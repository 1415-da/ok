// Storage Routes
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import config from '../config';
import {
  generateUploadUrl,
  generateDownloadUrl,
  getExecutorPubkey,
  uploadFile,
} from '../controllers/storage.controller';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    // Accept CSV files and other common formats
    const allowedTypes = ['.csv', '.json', '.txt', '.ipynb'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
    }
  },
});

// Generate signed upload URL
router.post('/upload-url', generateUploadUrl);

// Generate signed download URL
router.get('/download-url', generateDownloadUrl);

// Get executor public key
router.get('/executor-pubkey', getExecutorPubkey);

// Direct file upload (alternative to signed URL)
router.post('/upload', upload.single('file'), uploadFile);

export default router;
