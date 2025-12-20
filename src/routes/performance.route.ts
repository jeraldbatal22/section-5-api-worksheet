import { Router, Request, Response } from 'express';
import authorizeMiddleware from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { ResponseHandler } from '../utils/response-handler.util';
import { PerformanceTracker } from '../utils/performance.util';

const performanceRouter = Router();

/**
 * @route   GET /api/performance/metrics
 * @desc    Get all performance metrics
 * @access  Private (Admin only)
 */
performanceRouter.get(
  '/metrics',
  authorizeMiddleware,
  authorizeRoles('admin'),
  (_req: Request, res: Response) => {
    const metrics = PerformanceTracker.getMetrics();
    return ResponseHandler.success(res, metrics, 'Performance metrics retrieved');
  }
);

/**
 * @route   GET /api/performance/summary
 * @desc    Get performance summary
 * @access  Private (Admin only)
 */
performanceRouter.get(
  '/summary',
  authorizeMiddleware,
  authorizeRoles('admin'),
  (_req: Request, res: Response) => {
    const summary = PerformanceTracker.getSummary();
    return ResponseHandler.success(res, summary, 'Performance summary retrieved');
  }
);

/**
 * @route   GET /api/performance/endpoint/:path
 * @desc    Get metrics for specific endpoint
 * @access  Private (Admin only)
 */
performanceRouter.get(
  '/endpoint',
  authorizeMiddleware,
  authorizeRoles('admin'),
  (req: Request, res: Response) => {
    const path = req.query.path as string;
    if (!path) {
      return ResponseHandler.error(res, 'Query parameter "path" is required', 400);
    }
    const metrics = PerformanceTracker.getMetricsByEndpoint(path);
    return ResponseHandler.success(res, metrics, `Metrics for ${path} retrieved`);
  }
);

/**
 * @route   DELETE /api/performance/metrics
 * @desc    Clear all metrics
 * @access  Private (Admin only)
 */
performanceRouter.delete(
  '/metrics',
  authorizeMiddleware,
  authorizeRoles('admin'),
  (req: Request, res: Response) => {
    PerformanceTracker.clearMetrics();
    return ResponseHandler.success(res, null, 'Performance metrics cleared');
  }
);

export default performanceRouter;
