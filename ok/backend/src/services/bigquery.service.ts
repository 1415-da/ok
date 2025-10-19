// BigQuery Service for Metadata Storage
import { BigQuery } from '@google-cloud/bigquery';
import config from '../config';
import {
  Workflow,
  WorkflowApproval,
  Dataset,
  WrappedKey,
  ExecutionResult,
  WorkflowStatus,
  DashboardStats,
} from '../types';

class BigQueryService {
  private bigquery: BigQuery;
  private projectId: string;
  private datasetId: string;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: config.gcp.projectId,
      keyFilename: config.gcp.credentialsPath,
    });
    this.projectId = config.gcp.projectId;
    this.datasetId = config.gcp.dataset;
  }

  /**
   * Get full table ID
   */
  private getTableId(owner: string, tableSuffix: string): string {
    return `${this.projectId}.${this.datasetId}.${owner}${tableSuffix}`;
  }

  /**
   * Create workflow
   */
  async createWorkflow(workflow: Workflow): Promise<void> {
    const tableId = this.getTableId(workflow.creator, config.bigquery.workflowsTableSuffix);

    const rows = [
      {
        workflow_id: workflow.workflow_id,
        creator: workflow.creator,
        collaborator: workflow.collaborators,
        workload_path: workflow.workload_path,
        status: workflow.status,
        created_at: workflow.created_at,
      },
    ];

    try {
      await this.bigquery.dataset(this.datasetId).table(`${workflow.creator}${config.bigquery.workflowsTableSuffix}`).insert(rows);
    } catch (error: any) {
      throw new Error(`Failed to insert workflow: ${error.message}`);
    }
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: string, creator: string): Promise<Workflow | null> {
    const query = `
      SELECT * FROM \`${this.getTableId(creator, config.bigquery.workflowsTableSuffix)}\`
      WHERE workflow_id = @workflow_id
    `;

    const options = {
      query,
      params: { workflow_id: workflowId },
    };

    try {
      const [rows] = await this.bigquery.query(options);
      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        workflow_id: row.workflow_id,
        creator: row.creator,
        collaborators: row.collaborator || [],
        workload_path: row.workload_path,
        status: row.status as WorkflowStatus,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (error: any) {
      throw new Error(`Failed to get workflow: ${error.message}`);
    }
  }

  /**
   * Update workflow status
   */
  async updateWorkflowStatus(
    workflowId: string,
    creator: string,
    status: WorkflowStatus
  ): Promise<void> {
    const query = `
      UPDATE \`${this.getTableId(creator, config.bigquery.workflowsTableSuffix)}\`
      SET status = @status, updated_at = CURRENT_TIMESTAMP()
      WHERE workflow_id = @workflow_id
    `;

    const options = {
      query,
      params: { workflow_id: workflowId, status },
    };

    try {
      await this.bigquery.query(options);
    } catch (error: any) {
      throw new Error(`Failed to update workflow status: ${error.message}`);
    }
  }

  /**
   * Approve workflow
   */
  async approveWorkflow(workflowId: string, clientId: string): Promise<void> {
    const tableId = this.getTableId(clientId, config.bigquery.approvalsTableSuffix);

    const query = `
      INSERT INTO \`${tableId}\`
      (workflow_id, approver, approved, approved_at)
      VALUES (@workflow_id, @approver, @approved, CURRENT_TIMESTAMP())
    `;

    const options = {
      query,
      params: {
        workflow_id: workflowId,
        approver: clientId,
        approved: true,
      },
    };

    try {
      await this.bigquery.query(options);
    } catch (error: any) {
      throw new Error(`Failed to approve workflow: ${error.message}`);
    }
  }

  /**
   * Check if workflow is approved by client
   */
  async isWorkflowApproved(workflowId: string, clientId: string): Promise<boolean> {
    const tableId = this.getTableId(clientId, config.bigquery.approvalsTableSuffix);

    const query = `
      SELECT * FROM \`${tableId}\`
      WHERE workflow_id = @workflow_id
      ORDER BY approved_at DESC
      LIMIT 1
    `;

    const options = {
      query,
      params: { workflow_id: workflowId },
    };

    try {
      const [rows] = await this.bigquery.query(options);
      if (rows.length === 0) {
        return false;
      }
      return rows[0].approved === true;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Insert dataset metadata
   */
  async insertDataset(dataset: Dataset): Promise<void> {
    const tableId = this.getTableId(dataset.owner, config.bigquery.datasetsTableSuffix);

    const rows = [
      {
        dataset_id: dataset.dataset_id,
        workflow_id: dataset.workflow_id,
        owner: dataset.owner,
        filename: dataset.filename,
        gcs_path: dataset.gcs_path,
        created_at: dataset.created_at,
      },
    ];

    try {
      await this.bigquery.dataset(this.datasetId).table(`${dataset.owner}${config.bigquery.datasetsTableSuffix}`).insert(rows);
    } catch (error: any) {
      throw new Error(`Failed to insert dataset: ${error.message}`);
    }
  }

  /**
   * Insert wrapped key metadata
   */
  async insertKey(key: WrappedKey): Promise<void> {
    const tableId = this.getTableId(key.owner, config.bigquery.keysTableSuffix);

    const rows = [
      {
        dataset_id: key.dataset_id,
        workflow_id: key.workflow_id,
        owner: key.owner,
        gcs_path: key.gcs_path,
        created_at: key.created_at,
      },
    ];

    try {
      await this.bigquery.dataset(this.datasetId).table(`${key.owner}${config.bigquery.keysTableSuffix}`).insert(rows);
    } catch (error: any) {
      throw new Error(`Failed to insert key: ${error.message}`);
    }
  }

  /**
   * Get all datasets for a workflow
   */
  async getDatasets(workflowId: string, owner: string): Promise<Dataset[]> {
    const query = `
      SELECT dataset_id, gcs_path, filename, created_at
      FROM \`${this.getTableId(owner, config.bigquery.datasetsTableSuffix)}\`
      WHERE workflow_id = @workflow_id AND owner = @owner
      ORDER BY created_at DESC
    `;

    const options = {
      query,
      params: { workflow_id: workflowId, owner },
    };

    try {
      const [rows] = await this.bigquery.query(options);
      return rows.map((row: any) => ({
        dataset_id: row.dataset_id,
        workflow_id: workflowId,
        owner,
        filename: row.filename,
        gcs_path: row.gcs_path,
        created_at: row.created_at,
      }));
    } catch (error: any) {
      throw new Error(`Failed to get datasets: ${error.message}`);
    }
  }

  /**
   * Get all keys for a workflow
   */
  async getKeys(workflowId: string, owner: string): Promise<WrappedKey[]> {
    const query = `
      SELECT dataset_id, gcs_path, created_at
      FROM \`${this.getTableId(owner, config.bigquery.keysTableSuffix)}\`
      WHERE workflow_id = @workflow_id AND owner = @owner
      ORDER BY created_at DESC
    `;

    const options = {
      query,
      params: { workflow_id: workflowId, owner },
    };

    try {
      const [rows] = await this.bigquery.query(options);
      return rows.map((row: any) => ({
        key_id: row.dataset_id,
        dataset_id: row.dataset_id,
        workflow_id: workflowId,
        owner,
        gcs_path: row.gcs_path,
        created_at: row.created_at,
      }));
    } catch (error: any) {
      throw new Error(`Failed to get keys: ${error.message}`);
    }
  }

  /**
   * Insert execution result
   */
  async insertResults(results: ExecutionResult[]): Promise<void> {
    const tableId = `${this.projectId}.${this.datasetId}.${config.bigquery.resultsTable}`;

    const rows = results.map((result) => ({
      id: result.id,
      workflow_id: result.workflow_id,
      executed_notebook_path: result.executed_notebook_path,
      result_path: result.result_path,
      created_at: result.created_at,
    }));

    try {
      await this.bigquery.dataset(this.datasetId).table(config.bigquery.resultsTable).insert(rows);
    } catch (error: any) {
      throw new Error(`Failed to insert results: ${error.message}`);
    }
  }

  /**
   * Get all results for a workflow
   */
  async getResults(workflowId: string): Promise<ExecutionResult[]> {
    const tableId = `${this.projectId}.${this.datasetId}.${config.bigquery.resultsTable}`;

    const query = `
      SELECT id, workflow_id, executed_notebook_path, result_path, created_at
      FROM \`${tableId}\`
      WHERE workflow_id = @workflow_id
      ORDER BY created_at DESC
    `;

    const options = {
      query,
      params: { workflow_id: workflowId },
    };

    try {
      const [rows] = await this.bigquery.query(options);
      return rows.map((row: any) => ({
        id: row.id,
        workflow_id: row.workflow_id,
        executed_notebook_path: row.executed_notebook_path,
        result_path: row.result_path,
        created_at: row.created_at,
      }));
    } catch (error: any) {
      throw new Error(`Failed to get results: ${error.message}`);
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get total workflows
      const workflowsQuery = `
        SELECT COUNT(*) as total
        FROM \`${this.getTableId(userId, config.bigquery.workflowsTableSuffix)}\`
      `;
      const [workflowsRows] = await this.bigquery.query({ query: workflowsQuery });
      const totalWorkflows = workflowsRows[0]?.total || 0;

      // Get active workflows
      const activeQuery = `
        SELECT COUNT(*) as total
        FROM \`${this.getTableId(userId, config.bigquery.workflowsTableSuffix)}\`
        WHERE status IN ('PENDING_APPROVAL', 'APPROVED', 'RUNNING')
      `;
      const [activeRows] = await this.bigquery.query({ query: activeQuery });
      const activeWorkflows = activeRows[0]?.total || 0;

      // Get completed workflows
      const completedQuery = `
        SELECT COUNT(*) as total
        FROM \`${this.getTableId(userId, config.bigquery.workflowsTableSuffix)}\`
        WHERE status = 'COMPLETED'
      `;
      const [completedRows] = await this.bigquery.query({ query: completedQuery });
      const completedWorkflows = completedRows[0]?.total || 0;

      // Get total datasets
      const datasetsQuery = `
        SELECT COUNT(*) as total
        FROM \`${this.getTableId(userId, config.bigquery.datasetsTableSuffix)}\`
      `;
      const [datasetsRows] = await this.bigquery.query({ query: datasetsQuery });
      const totalDatasets = datasetsRows[0]?.total || 0;

      // Get total results
      const resultsQuery = `
        SELECT COUNT(*) as total
        FROM \`${this.projectId}.${this.datasetId}.${config.bigquery.resultsTable}\`
      `;
      const [resultsRows] = await this.bigquery.query({ query: resultsQuery });
      const totalResults = resultsRows[0]?.total || 0;

      // Get recent workflows
      const recentQuery = `
        SELECT *
        FROM \`${this.getTableId(userId, config.bigquery.workflowsTableSuffix)}\`
        ORDER BY created_at DESC
        LIMIT 5
      `;
      const [recentRows] = await this.bigquery.query({ query: recentQuery });
      const recentWorkflows = recentRows.map((row: any) => ({
        workflow_id: row.workflow_id,
        creator: row.creator,
        collaborators: row.collaborator || [],
        workload_path: row.workload_path,
        status: row.status as WorkflowStatus,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      return {
        total_workflows: totalWorkflows,
        active_workflows: activeWorkflows,
        completed_workflows: completedWorkflows,
        total_datasets: totalDatasets,
        total_results: totalResults,
        recent_workflows: recentWorkflows,
      };
    } catch (error: any) {
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }

  /**
   * Get all workflows for a user
   */
  async getAllWorkflows(userId: string): Promise<Workflow[]> {
    const query = `
      SELECT *
      FROM \`${this.getTableId(userId, config.bigquery.workflowsTableSuffix)}\`
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await this.bigquery.query({ query });
      return rows.map((row: any) => ({
        workflow_id: row.workflow_id,
        creator: row.creator,
        collaborators: row.collaborator || [],
        workload_path: row.workload_path,
        status: row.status as WorkflowStatus,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error: any) {
      throw new Error(`Failed to get workflows: ${error.message}`);
    }
  }
}

export default new BigQueryService();
