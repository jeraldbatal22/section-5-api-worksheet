import type { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler.middleware.ts';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: any, target: ValidationTarget = 'body') => {
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

// FOR JOI FORMATTING
// import type { Request, Response, NextFunction } from 'express';
// import { AppError } from './error-handler.middleware.ts';

// interface ValidationErrors {
//   [key: string]: string;
// }

// export const validate = (schema: any) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       const result = schema.safeParse(req.body);

//       if (!result.success) {
//         const errors: ValidationErrors = {};
//         result.error.errors.forEach((error: any) => {
//           // Format path to string for key
//           const field = error.path.join('.');
//           errors[field] = error.message;
//         });
//         throw new AppError(400, 'Validation failed', errors);
//       }

//       req.body = result.data;
//       next();
//     } catch (err) {
//       if (err instanceof AppError) {
//         throw err;
//       }
//       // fallback for unhandled errors
//       next(err);
//     }
//   };
// };
