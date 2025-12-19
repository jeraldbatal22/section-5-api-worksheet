import type { NextFunction, Response } from 'express';
import { AppError } from './error-handler.middleware.ts';
import type { IAuthRequest } from '../types';

export const authorizeRoles = (...roles: Array<'basic' | 'pro' | 'admin'>) => {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized - Authentication required');
    }
    if (!roles.includes(req.user?.role)) {
      throw new AppError(403, 'Unauthorized Role Permission');
    }
    next();
  };
};
