import type { Response, NextFunction } from 'express';
import CalculatorService from '../services/calculator.service.ts';
import type { IAuthRequest } from '../types/index.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import HttpStatus from 'http-status';

class CalculatorController {
  // Create calculation (add, subtract, multiply, divide)
  async calculate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { num1, num2, operation } = req.body;
      if (typeof num1 !== 'number' || typeof num2 !== 'number') {
        throw new AppError(HttpStatus.BAD_REQUEST, 'num1 and num2 must be numbers');
      }
      let result;
      const userId = req.user?.id as number;
      switch (operation) {
        case '+':
          result = await CalculatorService.add(num1, num2, userId);
          break;
        case '-':
          result = await CalculatorService.subtract(num1, num2, userId);
          break;
        case '*':
          result = await CalculatorService.multiply(num1, num2, userId);
          break;
        case '/':
          result = await CalculatorService.divide(num1, num2, userId);
          break;
        default:
          throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid operation');
      }
      ResponseHandler.success(res, result || null, 'Successfully Calculated', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all calculations (optionally filtered by user for authenticated)
  async getAll(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let limit = parseInt(req.query.limit as string) || 10;
      let offset = parseInt(req.query.offset as string) || 0;
      const userId = req.user?.id as number;
      const calculations = await CalculatorService.getCalculations({
        limit,
        offset,
        userId,
      });

      ResponseHandler.success(res, calculations || [], 'Successfully Fetched Calculations');
    } catch (error) {
      next(error);
    }
  }

  // Get calculation by ID
  async getById(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const calculation = await CalculatorService.getCalculationById(id as any);
      if (!calculation) {
        throw new AppError(HttpStatus.NOT_FOUND, 'Calculation not found');
      }
      ResponseHandler.success(res, calculation, 'Successfully Fetched Calculate');
    } catch (error) {
      next(error);
    }
  }
}

export default new CalculatorController();
