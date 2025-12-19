import currencyConverterService from '../services/currency-converter.service.ts';
import type { Response } from 'express';
import { convert } from '../utils/index.ts';
import type { IAuthRequest } from '../types/index.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import HttpStatus from 'http-status';

class CurrencyConverterController {
  createConversion = async (req: IAuthRequest, res: Response) => {
    const { from_value, from_currency, to_currency } = req.body;

    const convertedAmount = await convert(from_value, from_currency, to_currency);

    const conversion = await currencyConverterService.saveConversion(req.user?.id as number, {
      from_value,
      from_currency,
      to_currency,
      converted_value: convertedAmount,
    });
    ResponseHandler.success(res, conversion, 'Conversion created successfully', 201);
  };

  getUserConversions = async (req: IAuthRequest, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const conversions = await currencyConverterService.getConversionsByUserId(
      req?.user?.id as number,
      { limit, offset }
    );
    ResponseHandler.success(res, conversions, 'Conversions retrieved successfully');
  };
}

export default new CurrencyConverterController();
