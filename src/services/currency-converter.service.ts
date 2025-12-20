import { I_CurrencyConverter } from '../models/currency-converter.model';
import currencyConverterRepository from '../repositories/currency-converter.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import { T_CurrencyInput } from '../schemas/currency.schema';

interface CurrencyQueryOptions {
  limit?: number;
  offset?: number;
}

class CurrencyConverterService {
  // Save a new currency conversion record
  async saveConversion(userId: number, data: T_CurrencyInput): Promise<I_CurrencyConverter> {
    // Prevent duplicate per unique from_value/from_currency/to_currency/user_id
    const existing = await currencyConverterRepository.getConversionByCurrenciesByUserId(
      userId,
      data.from_currency,
      data.to_currency,
      data.from_value
    );
    if (existing) {
      throw new AppError(HttpStatus.CONFLICT, 'Currency conversion already exists');
    }

    return await currencyConverterRepository.saveConversion(userId, data);
  }

  // Get all conversions for a user, paginated
  async getConversionsByUserId(
    userId: number,
    options: CurrencyQueryOptions = {}
  ): Promise<I_CurrencyConverter[]> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    if (limit < 1 || limit > 100)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid limit (must be between 1 and 100)');
    if (offset < 0)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid offset (must be 0 or greater)');

    return await currencyConverterRepository.getConversionsByUserId(userId, limit, offset);
  }
}

export default new CurrencyConverterService();
