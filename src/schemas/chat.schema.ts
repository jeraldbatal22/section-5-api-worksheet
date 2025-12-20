import { z } from 'zod';

// Validation schemas for chat message using zod
export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be at most 1000 characters'),
  receiver_id: z.union([z.string().min(1, 'Receiver id is required')]), // Accepts string or number
  uploadTo: z.enum(['aws-s3', 'supabase-storage']).optional(), // Optional enum
});

// Type inference
export type T_SendMessageInput = z.infer<typeof sendMessageSchema>;
