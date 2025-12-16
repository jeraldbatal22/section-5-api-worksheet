import type {
  CurrencyConverter,
  CreateCurrencyConverterDTO,
  CurrencyCode,
} from "../model/currency-converter.model.ts";
import currencyConverterRepository from "../repositories/currency-converter.repository.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

interface CurrencyQueryOptions {
  limit?: number;
  offset?: number;
}

class CurrencyConverterService {
  // Save a new currency conversion record
  async saveConversion(
    userId: number,
    data: CreateCurrencyConverterDTO
  ): Promise<CurrencyConverter> {
    // Validation
    if (
      typeof data.from_value !== "number" ||
      !["PHP", "USD", "JPN"].includes(data.from_currency) ||
      !["PHP", "USD", "JPN"].includes(data.to_currency) ||
      typeof data.converted_value !== "number"
    ) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");
    }

    // Prevent duplicate per unique from_value/from_currency/to_currency/user_id
    const existing = await currencyConverterRepository.getConversionByCurrenciesByUserId(
      userId,
      data.from_currency,
      data.to_currency,
      data.from_value
    );
    if (existing) {
      throw new ErrorResponse(HttpStatus.CONFLICT, "Title must be a string.");
    }

    return await currencyConverterRepository.saveConversion(userId, data);
  }

  // Get all conversions for a user, paginated
  async getConversionsByUserId(
    userId: number,
    options: CurrencyQueryOptions = {}
  ): Promise<CurrencyConverter[]> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    if (limit < 1 || limit > 100) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");
    if (offset < 0) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");

    return await currencyConverterRepository.getConversionsByUserId(
      userId,
      limit,
      offset
    );
  }
}

export default new CurrencyConverterService();
