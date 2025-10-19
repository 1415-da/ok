// Error Handling Middleware
import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Not Found Handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: ApiError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global Error Handler
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details
  console.error('Error:', {
    statusCode,
    message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
};

/**
 * Async Handler Wrapper
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation Error Handler
 */
export const validationError = (message: string, statusCode: number = 400): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

/**
 * Custom Error Classes
 */
export class BadRequestError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Bad Request') {
    super(message);
    this.statusCode = 400;
    this.isOperational = true;
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.statusCode = 401;
    this.isOperational = true;
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.statusCode = 403;
    this.isOperational = true;
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Not Found') {
    super(message);
    this.statusCode = 404;
    this.isOperational = true;
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Conflict') {
    super(message);
    this.statusCode = 409;
    this.isOperational = true;
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.statusCode = 500;
    this.isOperational = false;
    this.name = 'InternalServerError';
  }
}
