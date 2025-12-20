import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.util';
import { PerformanceTracker } from '../utils/performance.util';

export const performanceMiddleware = (req: any, res: Response, next: NextFunction): void => {
  req.requestId = uuidv4();
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || Date.now());

    const metric = {
      requestId: req.requestId || 'unknown',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
    };

    PerformanceTracker.recordMetric(metric);

    logger.info('Request completed', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
