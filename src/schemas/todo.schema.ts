import { z } from 'zod';

// Todo creation schema
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  is_completed: z.boolean().optional().default(false),
});

// Todo update schema
export const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  is_completed: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be updated.' }
);

// Type inference
export type T_CreateTodoInput = z.infer<typeof createTodoSchema>;
export type T_UpdateTodoInput = z.infer<typeof updateTodoSchema>;
