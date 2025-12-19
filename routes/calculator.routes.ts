import { Router } from 'express';
import calculatorController from '../controller/calculator.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { createCalculationSchema } from '../schemas/calculator.schema.ts';

const calculatorRouter = Router();

calculatorRouter.post(
  '/calculate',
  validate(createCalculationSchema),
  asyncHandler(calculatorController.calculate)
);
calculatorRouter.get('/calculate', asyncHandler(calculatorController.getAll));
calculatorRouter.get('/calculate/:id', asyncHandler(calculatorController.getById));

export default calculatorRouter;
