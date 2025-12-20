import { z } from 'zod';

// Calculator operation type enum
const operationEnum = z.enum(['+', '-', '*', '/']);

// Schema for creating a calculation
export const createCalculationSchema = z.object({
  num1: z.number(),
  num2: z.number(),
  operation: operationEnum,
});

// Schema for updating a calculation (all fields optional)
export const updateCalculationSchema = z.object({
  num1: z.number().optional(),
  num2: z.number().optional(),
  operation: operationEnum.optional(),
});

// Inferred types
export type T_CreateCalculationInput = z.infer<typeof createCalculationSchema> & {
  user_id?: string;
};
export type T_UpdateCalculationInput = z.infer<typeof updateCalculationSchema> & {
  user_id?: string;
};
