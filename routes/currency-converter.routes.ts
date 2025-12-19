import { Router } from 'express';
import currencyConverterController from '../controller/currency-converter.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { currencySchema } from '../schemas/currency.schema.ts';

const currencyConvertRouter = Router();

currencyConvertRouter.post(
  '/',
  validate(currencySchema),
  asyncHandler(currencyConverterController.createConversion)
);
currencyConvertRouter.get('/', asyncHandler(currencyConverterController.getUserConversions));

export default currencyConvertRouter;
