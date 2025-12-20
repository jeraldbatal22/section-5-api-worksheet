import { Router } from 'express';
import currencyConverterController from '../controllers/currency-converter.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { currencySchema } from '../schemas/currency.schema';

const currencyConvertRouter = Router();

currencyConvertRouter.post(
  '/',
  validate(currencySchema),
  asyncHandler(currencyConverterController.createConversion)
);
currencyConvertRouter.get('/', asyncHandler(currencyConverterController.getUserConversions));

export default currencyConvertRouter;
