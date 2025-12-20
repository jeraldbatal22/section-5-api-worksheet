import { Router, Request, Response, NextFunction } from 'express';
import todoRouter from './todo.route';
import calculatorRouter from './calculator.route';
import shortenUrlRouter from './shorten-url.route';
import pokemonRouter from './pokemon.route';
import currencyConvertRouter from './currency-converter.route';
import bookmarkRouter from './bookmark.route';
import videoDownloaderRouter from './video-downloader.route';
import chatRouter from './chat.route';
import authRouter from './auth.route';
import authorizeMiddleware from '../middlewares/auth.middleware';
import instagramPostRouter from './instagram.route';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SUPABASE } from '../config/env.config';
import HttpStatus from 'http-status';
import performanceRouter from './performance.route';
import { AppError } from '../middlewares/error-handler.middleware';

const router = Router();

router.use('/', performanceRouter);
router.use('/auth', authRouter);
router.use('/todos', authorizeMiddleware, todoRouter);
router.use('/calculator', authorizeMiddleware, calculatorRouter);
router.use('/shorten-url', authorizeMiddleware, shortenUrlRouter);
router.use('/currency-convert', authorizeMiddleware, currencyConvertRouter);
router.use('/bookmarks', authorizeMiddleware, bookmarkRouter);
router.use('/video-downloader', authorizeMiddleware, videoDownloaderRouter);
router.use('/chats', authorizeMiddleware, chatRouter);
router.use('/instagram/posts', authorizeMiddleware, instagramPostRouter);

router.use('/pokemons', pokemonRouter);

router.get(
  '/session/status',
  authorizeMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'No token provided');
      }
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, SUPABASE.SECRET_KEY! as string) as JwtPayload;

      if (!decoded || !decoded.exp) {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid token');
      }

      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;
      if (timeLeft <= 0) {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'Token expired');
      }
      res.json({
        message: 'Session is valid',
        expiresIn: `${timeLeft} seconds`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
