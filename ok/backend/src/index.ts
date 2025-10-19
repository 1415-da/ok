// Main Express Application Entry Point
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import config from './config';
import workflowRoutes from './routes/workflow.routes';
import storageRoutes from './routes/storage.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = config.port || 8080;

// Ensure upload directories exist
const ensureDirectoriesExist = () => {
  const dirs = [config.upload.uploadDir, config.upload.tempDir];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

ensureDirectoriesExist();

// Middleware
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Confidential Clean Room Backend is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api', workflowRoutes);
app.use('/api', storageRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Confidential Clean Room API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      workflows: '/api/workflows',
      upload: '/api/upload-url',
      download: '/api/download-url',
      executor_pubkey: '/api/executor-pubkey',
      dashboard: '/api/dashboard/stats',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 =============================================');
  console.log(`🚀 Confidential Clean Room Backend`);
  console.log('🚀 =============================================');
  console.log(`🚀 Environment: ${config.nodeEnv}`);
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/health`);
  console.log(`🚀 Executor URL: ${config.executor.url}`);
  console.log(`🚀 GCP Project: ${config.gcp.projectId}`);
  console.log(`🚀 GCP Bucket: ${config.gcp.bucket}`);
  console.log('🚀 =============================================');
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;
