// Google Cloud Storage Service
import { Storage } from '@google-cloud/storage';
import config from '../config';
import path from 'path';
import fs from 'fs/promises';

class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    // Initialize GCS client with credentials
    this.storage = new Storage({
      projectId: config.gcp.projectId,
      keyFilename: config.gcp.credentialsPath,
    });
    this.bucket = config.gcp.bucket;
  }

  /**
   * Parse GCS URI into bucket and object path
   */
  private parseGcsUri(gcsUri: string): { bucket: string; objectPath: string } {
    if (!gcsUri.startsWith('gs://')) {
      throw new Error('GCS URI must start with gs://');
    }

    const rest = gcsUri.substring(5);
    const parts = rest.split('/', 1);

    if (parts.length === 0) {
      throw new Error('Invalid GCS URI format');
    }

    const bucketName = parts[0];
    const objectPath = rest.substring(bucketName.length + 1);

    return { bucket: bucketName, objectPath };
  }

  /**
   * Generate signed URL for uploading a file
   */
  async generateUploadUrl(
    objectName: string,
    expirationMinutes: number = 15,
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    const bucketInstance = this.storage.bucket(this.bucket);
    const file = bucketInstance.file(objectName);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + expirationMinutes * 60 * 1000,
      contentType,
    });

    return url;
  }

  /**
   * Generate signed URL for downloading a file
   */
  async generateDownloadUrl(
    gcsPath: string,
    expirationMinutes: number = 30
  ): Promise<string> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);
    const file = bucketInstance.file(objectPath);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationMinutes * 60 * 1000,
    });

    return url;
  }

  /**
   * Upload a file from local path to GCS
   */
  async uploadFile(localPath: string, gcsPath: string): Promise<string> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);

    await bucketInstance.upload(localPath, {
      destination: objectPath,
    });

    return gcsPath;
  }

  /**
   * Download a file from GCS to local path
   */
  async downloadFile(gcsPath: string, localPath: string): Promise<void> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);
    const file = bucketInstance.file(objectPath);

    await file.download({ destination: localPath });
  }

  /**
   * Download file as buffer
   */
  async downloadAsBuffer(gcsPath: string): Promise<Buffer> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);
    const file = bucketInstance.file(objectPath);

    const [buffer] = await file.download();
    return buffer;
  }

  /**
   * Check if a file exists in GCS
   */
  async fileExists(gcsPath: string): Promise<boolean> {
    try {
      const { bucket, objectPath } = this.parseGcsUri(gcsPath);
      const bucketInstance = this.storage.bucket(bucket);
      const file = bucketInstance.file(objectPath);

      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * List files under a prefix
   */
  async listFiles(prefix: string): Promise<string[]> {
    const bucketInstance = this.storage.bucket(this.bucket);
    const [files] = await bucketInstance.getFiles({ prefix });

    return files
      .filter(file => !file.name.endsWith('/')) // Filter out directory placeholders
      .map(file => `gs://${this.bucket}/${file.name}`);
  }

  /**
   * Delete a file from GCS
   */
  async deleteFile(gcsPath: string): Promise<void> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);
    const file = bucketInstance.file(objectPath);

    await file.delete();
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(gcsPath: string): Promise<any> {
    const { bucket, objectPath } = this.parseGcsUri(gcsPath);
    const bucketInstance = this.storage.bucket(bucket);
    const file = bucketInstance.file(objectPath);

    const [metadata] = await file.getMetadata();
    return metadata;
  }

  /**
   * Copy a file within GCS
   */
  async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    const source = this.parseGcsUri(sourcePath);
    const destination = this.parseGcsUri(destinationPath);

    const sourceBucket = this.storage.bucket(source.bucket);
    const sourceFile = sourceBucket.file(source.objectPath);

    const destBucket = this.storage.bucket(destination.bucket);
    const destFile = destBucket.file(destination.objectPath);

    await sourceFile.copy(destFile);
  }

  /**
   * Get the full GCS path for an object
   */
  getGcsPath(objectName: string): string {
    return `gs://${this.bucket}/${objectName}`;
  }

  /**
   * List result files under a workflow prefix
   */
  async listResultFiles(workflowId: string): Promise<string[]> {
    const prefix = `${config.results.pathPrefix}/${workflowId}/result/`;
    return this.listFiles(prefix);
  }

  /**
   * Check if model file exists for a workflow
   */
  async getModelPath(workflowId: string): Promise<string | null> {
    const modelPath = `${config.results.pathPrefix}/${workflowId}/result_model.zip`;
    const gcsPath = this.getGcsPath(modelPath);

    const exists = await this.fileExists(gcsPath);
    return exists ? gcsPath : null;
  }
}

export default new StorageService();
