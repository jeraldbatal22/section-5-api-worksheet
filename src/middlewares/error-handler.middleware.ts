import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { ResponseHandler } from '../utils/response-handler.util';

export class AppError extends Error {
  statusCode: number;
  message: string;
  details?: Record<string, string>;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    details?: Record<string, string>,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    if (err.details) {
      ResponseHandler.error(res, err.message, err.statusCode, err.details as any);
    } else {
      ResponseHandler.error(res, err.message, err.statusCode);
    }
  }

  if (err.message == 'Unauthorized') {
    ResponseHandler.error(res, err.message, 401);
  }

  // Default error
  ResponseHandler.error(
    res,
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHandler.error(res, `Route ${req.originalUrl} not found`, 404);
};
