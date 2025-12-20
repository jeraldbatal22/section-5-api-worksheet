import currencyConverterService from '../services/currency-converter.service';
import { Response } from 'express';
import { ResponseHandler } from '../utils/response-handler.util';
import { I_AuthRequest } from '../models/user.model';
import { convert } from '../utils/currency.util';

class CurrencyConverterController {
  createConversion = async (req: I_AuthRequest, res: Response) => {
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

  getUserConversions = async (req: I_AuthRequest, res: Response) => {
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
