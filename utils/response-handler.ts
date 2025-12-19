import { type Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    duration?: number;
    pagination?: {
      total?: number;
      limit?: number;
      offset?: number;
      [key: string]: any;
    };
  };
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    pagination?: {
      total?: number;
      limit?: number;
      offset?: number;
      [key: string]: any;
    },
    duration?: number
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...(duration !== undefined && { duration }),
        ...(pagination && { pagination }),
      },
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 500, error?: string): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error }),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created',
    pagination?: any
  ): Response {
    return this.success(res, data, message, 201, undefined, pagination);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
