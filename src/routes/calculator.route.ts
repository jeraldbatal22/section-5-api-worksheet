import { Router } from 'express';
import calculatorController from '../controllers/calculator.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCalculationSchema } from '../schemas/calculator.schema';

const calculatorRouter = Router();

calculatorRouter.post(
  '/calculate',
  validate(createCalculationSchema),
  asyncHandler(calculatorController.calculate)
);
calculatorRouter.get('/calculate', asyncHandler(calculatorController.getAll));
calculatorRouter.get('/calculate/:id', asyncHandler(calculatorController.getById));

export default calculatorRouter;
