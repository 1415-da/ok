// Type definitions for Confidential Clean Room Backend

export interface Workflow {
  workflow_id: string;
  creator: string;
  collaborators: string[];
  workload_path: string;
  status: WorkflowStatus;
  created_at: string;
  updated_at?: string;
}

export enum WorkflowStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface WorkflowApproval {
  workflow_id: string;
  approver: string;
  approved: boolean;
  approved_at: string;
}

export interface Dataset {
  dataset_id: string;
  workflow_id: string;
  owner: string;
  filename: string;
  gcs_path: string;
  created_at: string;
}

export interface WrappedKey {
  key_id: string;
  dataset_id: string;
  workflow_id: string;
  owner: string;
  gcs_path: string;
  created_at: string;
}

export interface ExecutionResult {
  id: string;
  workflow_id: string;
  executed_notebook_path: string;
  result_path: string;
  created_at: string;
}

export interface DatasetSpec {
  owner: string;
  ciphertext_gcs: string;
  wrapped_dek_gcs: string;
}

export interface ExecuteRequest {
  workflow_id: string;
  workload_gcs: string;
  datasets: DatasetSpec[];
  result_base: string;
  executed_notebook_base: string;
}

export interface ExecuteResponse {
  status: string;
  workflow_id: string;
  executed_notebook_path: string;
  result_paths: string[];
  model_gcs_path?: string;
}

export interface UploadUrlRequest {
  workflow_id: string;
  dataset_id: string;
  filename: string;
  file_type: 'dataset' | 'workload' | 'key';
  owner: string;
}

export interface UploadUrlResponse {
  upload_url: string;
  gcs_path: string;
  id: string;
}

export interface DownloadUrlRequest {
  gcs_path: string;
}

export interface DownloadUrlResponse {
  download_url: string;
}

export interface AttestationResponse {
  public_key_pem: string;
  attestation_token: string;
}

export interface WorkflowLog {
  workflow_id: string;
  logs: string[];
}

export interface ResultWithUrl {
  result_path: string;
  executed_notebook_path: string;
  created_at: string;
  download_url: string;
}

export interface WorkflowResultsResponse {
  workflow_id: string;
  results: ResultWithUrl[];
}

export interface CreateWorkflowRequest {
  workflow_id: string;
  creator: string;
  collaborators: string[];
}

export interface RunWorkflowRequest {
  workflow_id: string;
  creator: string;
  collaborators: string[];
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Request/Response types for API endpoints
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Crypto types
export interface EncryptedDataset {
  dataset_id: string;
  workflow_id: string;
  filename: string;
  owner: string;
  ciphertext_gcs: string;
  wrapped_dek_gcs: string;
  upload_status_dataset: number;
  upload_status_dek: number;
}

// Dashboard statistics
export interface DashboardStats {
  total_workflows: number;
  active_workflows: number;
  completed_workflows: number;
  total_datasets: number;
  total_results: number;
  recent_workflows: Workflow[];
}

export interface ProcessingStatus {
  workflow_id: string;
  status: WorkflowStatus;
  progress: number;
  current_step: string;
  message: string;
  started_at?: string;
  completed_at?: string;
}
