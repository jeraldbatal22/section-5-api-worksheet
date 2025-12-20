import { I_UrlShortener } from '../models/url-shortener.model';
import urlShortenerRepository from '../repositories/url-shortener.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import { T_CreateShortenUrlInput } from '../schemas/url-shortener.schema';

interface UrlQueryOptions {
  limit?: number;
  offset?: number;
}

class UrlShortenerService {
  // Shorten a given URL
  async shortenUrl(
    userId: number | string,
    data: T_CreateShortenUrlInput
  ): Promise<I_UrlShortener> {
    if (
      typeof data.url !== 'string' ||
      !data.url.trim() ||
      typeof data.shorten_url !== 'string' ||
      !data.shorten_url.trim()
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Both url and shorten_url must be non-empty strings'
      );
    }
    return await urlShortenerRepository.shortenUrl(userId, data);
  }

  // Find original URL by short code
  async findByShortCode(shorten_url: string): Promise<I_UrlShortener | null> {
    if (typeof shorten_url !== 'string' || !shorten_url.trim()) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'shorten_url must be a non-empty string');
    }

    return await urlShortenerRepository.findByShortCode(shorten_url);
  }

  // Get all URLs for a user, paginated
  async getUrlShortenerByUserId(
    userId: number | string,
    options: UrlQueryOptions = {}
  ): Promise<I_UrlShortener[]> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    if (limit < 1 || limit > 100) throw new AppError(HttpStatus.BAD_REQUEST, 'INVALID_LIMIT');
    if (offset < 0) throw new AppError(HttpStatus.BAD_REQUEST, 'INVALID_OFFSET');

    return await urlShortenerRepository.getUrlShortenerByUserId(userId, limit, offset);
  }
}

export default new UrlShortenerService();
