// Workflow Controller - Handles all workflow-related API requests
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../config';
import bigqueryService from '../services/bigquery.service';
import storageService from '../services/storage.service';
import {
  Workflow,
  WorkflowStatus,
  DatasetSpec,
  ExecuteRequest,
  ExecutionResult,
  CreateWorkflowRequest,
  RunWorkflowRequest,
} from '../types';

/**
 * Create a new workflow
 */
export const createWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id, creator, collaborators } = req.body as CreateWorkflowRequest;

    if (!workflow_id || !creator || !collaborators) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: workflow_id, creator, collaborators',
      });
      return;
    }

    const workflow: Workflow = {
      workflow_id,
      creator,
      collaborators,
      workload_path: config.workload.fixedPath,
      status: WorkflowStatus.PENDING_APPROVAL,
      created_at: new Date().toISOString(),
    };

    await bigqueryService.createWorkflow(workflow);

    res.status(200).json({
      success: true,
      data: {
        workflow_id,
        status: WorkflowStatus.PENDING_APPROVAL,
      },
    });
  } catch (error: any) {
    console.error('Error creating workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create workflow',
      message: error.message,
    });
  }
};

/**
 * Get workflow by ID
 */
export const getWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id } = req.params;
    const { creator } = req.query;

    if (!creator) {
      res.status(400).json({
        success: false,
        error: 'Creator parameter is required',
      });
      return;
    }

    const workflow = await bigqueryService.getWorkflow(workflow_id, creator as string);

    if (!workflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    console.error('Error getting workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow',
      message: error.message,
    });
  }
};

/**
 * Approve workflow
 */
export const approveWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id } = req.params;
    const { client_id } = req.query;

    if (!client_id) {
      res.status(400).json({
        success: false,
        error: 'client_id parameter is required',
      });
      return;
    }

    await bigqueryService.approveWorkflow(workflow_id, client_id as string);

    res.status(200).json({
      success: true,
      data: {
        workflow_id,
        status: `APPROVED_BY_${client_id}`,
      },
    });
  } catch (error: any) {
    console.error('Error approving workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve workflow',
      message: error.message,
    });
  }
};

/**
 * Run workflow
 */
export const runWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id } = req.params;
    const { creator, collaborators } = req.query;

    if (!creator || !collaborators) {
      res.status(400).json({
        success: false,
        error: 'creator and collaborators parameters are required',
      });
      return;
    }

    const collaboratorList = typeof collaborators === 'string'
      ? collaborators.split(',').map(c => c.trim())
      : collaborators as string[];

    // Check approvals from all collaborators
    for (const collaborator of collaboratorList) {
      const isApproved = await bigqueryService.isWorkflowApproved(workflow_id, collaborator);
      if (!isApproved) {
        res.status(403).json({
          success: false,
          error: `Workflow not approved by ${collaborator}`,
        });
        return;
      }
    }

    // Get workflow details
    const workflow = await bigqueryService.getWorkflow(workflow_id, creator as string);
    if (!workflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
      });
      return;
    }

    // Update workflow status to RUNNING
    await bigqueryService.updateWorkflowStatus(workflow_id, creator as string, WorkflowStatus.RUNNING);

    // Gather datasets from creator
    const creatorDatasets = await bigqueryService.getDatasets(workflow_id, creator as string);
    const creatorKeys = await bigqueryService.getKeys(workflow_id, creator as string);

    const datasets: DatasetSpec[] = [];

    // Match datasets with keys
    for (const dataset of creatorDatasets) {
      const key = creatorKeys.find(k => k.dataset_id === dataset.dataset_id);
      if (key) {
        datasets.push({
          owner: creator as string,
          ciphertext_gcs: dataset.gcs_path,
          wrapped_dek_gcs: key.gcs_path,
        });
      }
    }

    // Gather datasets from collaborators
    for (const collaborator of collaboratorList) {
      if (collaborator === creator) continue;

      const collabDatasets = await bigqueryService.getDatasets(workflow_id, collaborator);
      const collabKeys = await bigqueryService.getKeys(workflow_id, collaborator);

      for (const dataset of collabDatasets) {
        const key = collabKeys.find(k => k.dataset_id === dataset.dataset_id);
        if (key) {
          datasets.push({
            owner: collaborator,
            ciphertext_gcs: dataset.gcs_path,
            wrapped_dek_gcs: key.gcs_path,
          });
        }
      }
    }

    if (datasets.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No datasets found for this workflow',
      });
      return;
    }

    const resultBase = `gs://${config.gcp.bucket}/results/${workflow_id}/result`;
    const executedBase = `gs://${config.gcp.bucket}/results/${workflow_id}/executed`;

    const execPayload: ExecuteRequest = {
      workflow_id,
      workload_gcs: workflow.workload_path,
      datasets,
      result_base: resultBase,
      executed_notebook_base: executedBase,
    };

    // Call executor service
    try {
      const executorResponse = await axios.post(
        `${config.executor.url}/execute`,
        execPayload,
        { timeout: 600000 } // 10 minutes
      );

      const resultInfo = executorResponse.data;

      // Insert results into BigQuery
      const resultPaths = resultInfo.result_paths || [];
      const executedNotebookPath = resultInfo.executed_notebook_path;
      const createdTime = new Date().toISOString();

      const results: ExecutionResult[] = resultPaths.map((path: string) => ({
        id: uuidv4(),
        workflow_id,
        executed_notebook_path: executedNotebookPath,
        result_path: path,
        created_at: createdTime,
      }));

      if (results.length > 0) {
        await bigqueryService.insertResults(results);
      }

      // Update workflow status to COMPLETED
      await bigqueryService.updateWorkflowStatus(workflow_id, creator as string, WorkflowStatus.COMPLETED);

      // Check for trained model
      const modelGcsPath = await storageService.getModelPath(workflow_id);

      res.status(200).json({
        success: true,
        data: {
          status: 'success',
          executed_notebook: executedNotebookPath,
          result_json_paths: resultPaths,
          model_gcs_path: modelGcsPath,
        },
      });
    } catch (executorError: any) {
      console.error('Executor error:', executorError);

      // Update workflow status to FAILED
      await bigqueryService.updateWorkflowStatus(workflow_id, creator as string, WorkflowStatus.FAILED);

      res.status(502).json({
        success: false,
        error: 'Executor failed',
        message: executorError.message,
      });
    }
  } catch (error: any) {
    console.error('Error running workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run workflow',
      message: error.message,
    });
  }
};

/**
 * Get workflow results
 */
export const getWorkflowResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id } = req.params;

    const results = await bigqueryService.getResults(workflow_id);

    if (results.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No results found for this workflow',
      });
      return;
    }

    // Generate signed URLs for each result
    const resultsWithUrls = await Promise.all(
      results.map(async (result) => {
        const downloadUrl = await storageService.generateDownloadUrl(result.result_path, 30);
        return {
          result_path: result.result_path,
          executed_notebook_path: result.executed_notebook_path,
          created_at: result.created_at,
          download_url: downloadUrl,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        workflow_id,
        results: resultsWithUrls,
      },
    });
  } catch (error: any) {
    console.error('Error getting workflow results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow results',
      message: error.message,
    });
  }
};

/**
 * Get workflow logs from executor
 */
export const getWorkflowLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id } = req.params;

    const executorResponse = await axios.get(
      `${config.executor.url}/logs/${workflow_id}`,
      { timeout: 5000 }
    );

    res.status(200).json({
      success: true,
      data: executorResponse.data,
    });
  } catch (error: any) {
    console.error('Error getting workflow logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow logs',
      message: error.message,
    });
  }
};

/**
 * Get all workflows for a user
 */
export const getAllWorkflows = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      res.status(400).json({
        success: false,
        error: 'user_id parameter is required',
      });
      return;
    }

    const workflows = await bigqueryService.getAllWorkflows(user_id as string);

    res.status(200).json({
      success: true,
      data: workflows,
    });
  } catch (error: any) {
    console.error('Error getting all workflows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflows',
      message: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      res.status(400).json({
        success: false,
        error: 'user_id parameter is required',
      });
      return;
    }

    const stats = await bigqueryService.getDashboardStats(user_id as string);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard stats',
      message: error.message,
    });
  }
};
