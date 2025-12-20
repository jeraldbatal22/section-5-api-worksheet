import { I_Calculator } from '../models/calculator.model';
import calculatorRepository from '../repositories/calculator.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';

interface CalculationOptions {
  limit?: number;
  offset?: number;
  userId?: number;
}

class CalculatorService {
  // Addition
  async add(num1: number, num2: number, userId?: number): Promise<I_Calculator> {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'num1 and num2 must be numbers');
    }
    return await calculatorRepository.add({ user_id: userId, num1, num2 });
  }

  // Subtraction
  async subtract(num1: number, num2: number, userId?: number): Promise<I_Calculator> {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'num1 and num2 must be numbers');
    }
    return await calculatorRepository.subtract({ user_id: userId, num1, num2 });
  }

  // Multiplication
  async multiply(num1: number, num2: number, userId?: number): Promise<I_Calculator> {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'num1 and num2 must be numbers');
    }
    return await calculatorRepository.multiply({ user_id: userId, num1, num2 });
  }

  // Division
  async divide(num1: number, num2: number, userId?: number): Promise<I_Calculator> {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'num1 and num2 must be numbers');
    }
    if (num2 === 0) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Division by zero is not allowed');
    }
    return await calculatorRepository.divide({ user_id: userId, num1, num2 });
  }

  // Get calculation by ID
  async getCalculationById(id: number): Promise<I_Calculator | null> {
    return await calculatorRepository.findById(id);
  }

  // Get all calculations (optionally by user)
  async getCalculations(options: CalculationOptions = {}): Promise<I_Calculator[]> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    if (limit < 1 || limit > 100)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid limit (must be between 1 and 100)');
    if (offset < 0)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid offset (must be 0 or greater)');
    return await calculatorRepository.findAllByUserId(options.userId, limit, offset);
  }
}

export default new CalculatorService();
