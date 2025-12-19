import type { Response, NextFunction } from 'express';
import UrlShortenerService from '../services/url-shortener.service.ts';
import type { IAuthRequest } from '../types/index.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import HttpStatus from 'http-status';

class ShortenUrlController {
  // Create a shortened URL
  async create(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { url, shorten_url } = req.body;

      const result = await UrlShortenerService.shortenUrl(req?.user?.id as string, {
        url,
        shorten_url,
      });

      ResponseHandler.success(res, result || null, 'Successfully shortened URL', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all shortened URLs for the user (paginated)
  async getAll(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const data = await UrlShortenerService.getUrlShortenerByUserId(req?.user?.id as string, {
        limit,
        offset,
      });

      ResponseHandler.success(res, data || [], 'Successfully retrieved shortened URLs');
    } catch (error) {
      next(error);
    }
  }

  // Find full/original URL by short code
  async getByShortCode(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shortCode } = req.params;

      const result = await UrlShortenerService.findByShortCode(shortCode);

      if (!result) {
        throw new AppError(HttpStatus.NOT_FOUND, 'Shortened URL not found');
      }

      ResponseHandler.success(res, result || null, 'Successfully retrieved shortened URL');
    } catch (error) {
      next(error);
    }
  }
}

export default new ShortenUrlController();
