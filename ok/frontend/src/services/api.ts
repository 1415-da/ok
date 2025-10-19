// API Service for Backend Communication
import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 10 minutes for long-running operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here
    // console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    // console.error('[API] Request error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // console.log(`[API] Response:`, response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    // console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// Types
export interface Workflow {
  workflow_id: string;
  creator: string;
  collaborators: string[];
  workload_path: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateWorkflowRequest {
  workflow_id: string;
  creator: string;
  collaborators: string[];
}

export interface UploadUrlResponse {
  upload_url: string;
  gcs_path: string;
  id: string;
}

export interface WorkflowResult {
  result_path: string;
  executed_notebook_path: string;
  created_at: string;
  download_url: string;
}

export interface WorkflowResultsResponse {
  workflow_id: string;
  results: WorkflowResult[];
}

export interface DashboardStats {
  total_workflows: number;
  active_workflows: number;
  completed_workflows: number;
  total_datasets: number;
  total_results: number;
  recent_workflows: Workflow[];
}

export interface ExecutorPublicKey {
  public_key_pem: string;
  attestation_token: string;
}

// API Methods
export const api = {
  // Workflow endpoints
  workflows: {
    create: async (data: CreateWorkflowRequest) => {
      const response = await apiClient.post("/workflows", data);
      return response.data;
    },

    get: async (workflowId: string, creator: string) => {
      const response = await apiClient.get(`/workflows/${workflowId}`, {
        params: { creator },
      });
      return response.data;
    },

    getAll: async (userId: string) => {
      const response = await apiClient.get("/workflows", {
        params: { user_id: userId },
      });
      return response.data;
    },

    approve: async (workflowId: string, clientId: string) => {
      const response = await apiClient.post(
        `/workflows/${workflowId}/approve`,
        null,
        {
          params: { client_id: clientId },
        },
      );
      return response.data;
    },

    run: async (
      workflowId: string,
      creator: string,
      collaborators: string[],
    ) => {
      const response = await apiClient.post(
        `/workflows/${workflowId}/run`,
        null,
        {
          params: {
            creator,
            collaborators: collaborators.join(","),
          },
        },
      );
      return response.data;
    },

    getResults: async (
      workflowId: string,
    ): Promise<WorkflowResultsResponse> => {
      const response = await apiClient.get(`/workflows/${workflowId}/result`);
      return response.data.data;
    },

    getLogs: async (workflowId: string) => {
      const response = await apiClient.get(`/logs/${workflowId}`);
      return response.data;
    },
  },

  // Storage endpoints
  storage: {
    generateUploadUrl: async (params: {
      workflow_id: string;
      dataset_id: string;
      filename: string;
      file_type: "dataset" | "workload" | "key";
      owner: string;
    }): Promise<UploadUrlResponse> => {
      const response = await apiClient.post("/upload-url", null, { params });
      return response.data.data;
    },

    generateDownloadUrl: async (gcsPath: string) => {
      const response = await apiClient.get("/download-url", {
        params: { gcs_path: gcsPath },
      });
      return response.data.data;
    },

    uploadToSignedUrl: async (url: string, data: Blob | ArrayBuffer) => {
      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      return response;
    },

    getExecutorPubkey: async (): Promise<ExecutorPublicKey> => {
      const response = await apiClient.get("/executor-pubkey");
      return response.data.data;
    },
  },

  // Dashboard endpoints
  dashboard: {
    getStats: async (userId: string): Promise<DashboardStats> => {
      const response = await apiClient.get("/dashboard/stats", {
        params: { user_id: userId },
      });
      return response.data.data;
    },
  },
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

export default api;
