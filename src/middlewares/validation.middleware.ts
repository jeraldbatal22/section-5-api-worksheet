import { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler.middleware';

type T_ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: any, target: T_ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req[target]);
      if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const path = Array.isArray(issue.path) ? issue.path.join('.') : '';
          errors[path] = issue.message;
        }
        throw new AppError(400, 'Validation failed', errors);
      }
      req[target] = result.data;
      next();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      next(err);
    }
  };
};
