// Configuration for Confidential Clean Room Backend
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  gcp: {
    projectId: string;
    dataset: string;
    bucket: string;
    credentialsPath: string;
  };
  executor: {
    url: string;
  };
  security: {
    jwtSecret: string;
    encryptionKey: string;
  };
  cors: {
    allowedOrigins: string[];
  };
  upload: {
    maxFileSize: number;
    uploadDir: string;
    tempDir: string;
  };
  results: {
    bucket: string;
    pathPrefix: string;
  };
  bigquery: {
    workflowsTableSuffix: string;
    approvalsTableSuffix: string;
    datasetsTableSuffix: string;
    keysTableSuffix: string;
    resultsTable: string;
  };
  workload: {
    fixedPath: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  gcp: {
    projectId: process.env.GCP_PROJECT_ID || 'yellowsense-technologies',
    dataset: process.env.GCP_DATASET || 'cleanroom',
    bucket: process.env.GCP_BUCKET || 'yellowsense-technologies-cleanroom',
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../../service-account-key.json'),
  },

  executor: {
    url: process.env.EXECUTOR_URL || 'http://localhost:8443',
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-change-in-production',
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    tempDir: process.env.TEMP_DIR || path.join(__dirname, '../../temp'),
  },

  results: {
    bucket: process.env.RESULTS_BUCKET || 'yellowsense-technologies-cleanroom',
    pathPrefix: process.env.RESULTS_PATH_PREFIX || 'results',
  },

  bigquery: {
    workflowsTableSuffix: process.env.WORKFLOWS_TABLE_SUFFIX || '_workflows',
    approvalsTableSuffix: process.env.APPROVALS_TABLE_SUFFIX || '_workflow_approvals',
    datasetsTableSuffix: process.env.DATASETS_TABLE_SUFFIX || '_datasets',
    keysTableSuffix: process.env.KEYS_TABLE_SUFFIX || '_keys',
    resultsTable: process.env.RESULTS_TABLE || 'results',
  },

  workload: {
    fixedPath: process.env.FIXED_WORKLOAD_PATH || 'gs://yellowsense-technologies-cleanroom/workloads/fraud-detector.ipynb',
  },
};

export default config;
