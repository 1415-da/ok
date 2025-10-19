// Storage Controller - Handles file uploads and signed URL generation
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import bigqueryService from '../services/bigquery.service';
import storageService from '../services/storage.service';
import { Dataset, WrappedKey } from '../types';

/**
 * Generate signed upload URL
 */
export const generateUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workflow_id, dataset_id, filename, file_type, owner } = req.query;

    if (!workflow_id || !dataset_id || !filename || !file_type || !owner) {
      res.status(400).json({
        success: false,
        error: 'Missing required parameters: workflow_id, dataset_id, filename, file_type, owner',
      });
      return;
    }

    // Validate file_type
    if (!['dataset', 'workload', 'key'].includes(file_type as string)) {
      res.status(400).json({
        success: false,
        error: 'file_type must be one of: dataset, workload, key',
      });
      return;
    }

    // Construct object name
    const objectName = `${file_type}s/${owner}/${workflow_id}/${dataset_id}/${filename}`;
    const gcsPath = storageService.getGcsPath(objectName);

    // Generate signed URL
    const uploadUrl = await storageService.generateUploadUrl(
      objectName,
      15, // 15 minutes expiration
      'application/octet-stream'
    );

    // Insert metadata into BigQuery
    const createdAt = new Date().toISOString();

    if (file_type === 'dataset') {
      const dataset: Dataset = {
        dataset_id: dataset_id as string,
        workflow_id: workflow_id as string,
        owner: owner as string,
        filename: filename as string,
        gcs_path: gcsPath,
        created_at: createdAt,
      };
      await bigqueryService.insertDataset(dataset);
    } else if (file_type === 'key') {
      const key: WrappedKey = {
        key_id: dataset_id as string,
        dataset_id: dataset_id as string,
        workflow_id: workflow_id as string,
        owner: owner as string,
        gcs_path: gcsPath,
        created_at: createdAt,
      };
      await bigqueryService.insertKey(key);
    }

    res.status(200).json({
      success: true,
      data: {
        upload_url: uploadUrl,
        gcs_path: gcsPath,
        id: workflow_id,
      },
    });
  } catch (error: any) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL',
      message: error.message,
    });
  }
};

/**
 * Generate signed download URL
 */
export const generateDownloadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gcs_path } = req.query;

    if (!gcs_path) {
      res.status(400).json({
        success: false,
        error: 'gcs_path parameter is required',
      });
      return;
    }

    const gcsPathStr = gcs_path as string;

    if (!gcsPathStr.startsWith('gs://')) {
      res.status(400).json({
        success: false,
        error: 'Invalid GCS path format. Must start with gs://',
      });
      return;
    }

    // Generate signed download URL
    const downloadUrl = await storageService.generateDownloadUrl(gcsPathStr, 30);

    res.status(200).json({
      success: true,
      data: {
        download_url: downloadUrl,
      },
    });
  } catch (error: any) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate download URL',
      message: error.message,
    });
  }
};

/**
 * Get executor public key (proxy to executor)
 */
export const getExecutorPubkey = async (req: Request, res: Response): Promise<void> => {
  try {
    const axios = require('axios');
    const executorResponse = await axios.get(
      `${config.executor.url}/attestation`,
      { timeout: 10000 }
    );

    res.status(200).json({
      success: true,
      data: executorResponse.data,
    });
  } catch (error: any) {
    console.error('Error getting executor pubkey:', error);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch executor public key',
      message: error.message,
    });
  }
};

/**
 * Upload file directly (alternative to signed URL)
 */
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    const { workflow_id, dataset_id, file_type, owner } = req.body;

    if (!workflow_id || !dataset_id || !file_type || !owner) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: workflow_id, dataset_id, file_type, owner',
      });
      return;
    }

    const file = req.file;
    const objectName = `${file_type}s/${owner}/${workflow_id}/${dataset_id}/${file.originalname}`;
    const gcsPath = storageService.getGcsPath(objectName);

    // Upload file to GCS
    await storageService.uploadFile(file.path, gcsPath);

    // Insert metadata into BigQuery
    const createdAt = new Date().toISOString();

    if (file_type === 'dataset') {
      const dataset: Dataset = {
        dataset_id,
        workflow_id,
        owner,
        filename: file.originalname,
        gcs_path: gcsPath,
        created_at: createdAt,
      };
      await bigqueryService.insertDataset(dataset);
    } else if (file_type === 'key') {
      const key: WrappedKey = {
        key_id: dataset_id,
        dataset_id,
        workflow_id,
        owner,
        gcs_path: gcsPath,
        created_at: createdAt,
      };
      await bigqueryService.insertKey(key);
    }

    res.status(200).json({
      success: true,
      data: {
        gcs_path: gcsPath,
        filename: file.originalname,
        size: file.size,
      },
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      message: error.message,
    });
  }
};
