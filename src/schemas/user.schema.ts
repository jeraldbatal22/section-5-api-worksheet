// src/schemas/user.schema.ts
import { z } from 'zod';

// Base schemas
export const userRoleSchema = z.enum(['basic', 'pro', 'admin']);

export const emailSchema = z.email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Registration schema
export const registerSchema = z.object({
  username: emailSchema,
  password: passwordSchema,
  role: userRoleSchema.default('basic').optional(),
  avatar_url: z.url('Avatar URL must be a valid URL').optional(),
});

// Login schema
export const loginSchema = z.object({
  username: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Type inference - This is the magic of Zod!
export type T_RegisterInput = z.infer<typeof registerSchema>;
export type T_LoginInput = z.infer<typeof loginSchema>;
export type T_UserRole = z.infer<typeof userRoleSchema>;
