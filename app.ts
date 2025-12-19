import express, { type Application, type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.routes.ts';
import createRateLimiter from './middleware/rate-limiter.middleware.ts';
import { NODE_ENV, PORT } from './config/env.config.ts';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware.ts';
import { logger } from './utils/logger.utils.ts';
import { initializeSupabaseDatabase } from './config/supabase.config.ts';
import { ResponseHandler } from './utils/response-handler.ts';
import { performanceMiddleware } from './middleware/performance.middleware.ts';

class AppServer {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(createRateLimiter({}));
    this.app.use(performanceMiddleware);
  }

  private initializeRoutes() {
    this.app.get('/', (req: Request, res: Response) => {
      ResponseHandler.success(res, {
        message: 'Welcome to the training: API WORKSHEET',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          performance: '/api/performance',
          health: '/health',
        },
        documentation: 'https://github.com/your-repo/docs',
      });
    });

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      ResponseHandler.success(
        res,
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: NODE_ENV,
        },
        'Service is healthy'
      );
    });

    this.app.use(router);
  }

  private initializeErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async listen() {
    if (process.env.NODE_ENV !== 'test') {
      this.app.listen(PORT as any, '0.0.0.0', async () => {
        try {
          initializeSupabaseDatabase();
          logger.info('Database initialized successfully');
        } catch (error) {
          logger.error('Failed to initialize database:', error);
          process.exit(1);
        }
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📝 Environment: ${NODE_ENV}`);
        logger.info(`🔗 API available at http://localhost:${PORT}`);
      });
    }
  }
}

export const server = new AppServer();
server.listen();
