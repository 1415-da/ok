// Workflow Routes
import { Router } from 'express';
import {
  createWorkflow,
  getWorkflow,
  approveWorkflow,
  runWorkflow,
  getWorkflowResults,
  getWorkflowLogs,
  getAllWorkflows,
  getDashboardStats,
} from '../controllers/workflow.controller';

const router = Router();

// Create a new workflow
router.post('/workflows', createWorkflow);

// Get workflow by ID
router.get('/workflows/:workflow_id', getWorkflow);

// Approve workflow
router.post('/workflows/:workflow_id/approve', approveWorkflow);

// Run workflow
router.post('/workflows/:workflow_id/run', runWorkflow);

// Get workflow results
router.get('/workflows/:workflow_id/result', getWorkflowResults);

// Get workflow logs
router.get('/logs/:workflow_id', getWorkflowLogs);

// Get all workflows for a user
router.get('/workflows', getAllWorkflows);

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;
