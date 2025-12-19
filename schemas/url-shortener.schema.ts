import { z } from 'zod';

// Schema for creating a new shortened URL
export const createShortenUrlSchema = z.object({
  url: z.url({ message: 'Invalid URL format' }),
  shorten_url: z.string().min(1, 'Shorten URL is required'),
});

// Schema for updating a shortened URL (partial updates allowed)
export const updateShortenUrlSchema = z
  .object({
    url: z.url({ message: 'Invalid URL format' }).optional(),
    shorten_url: z.string().min(1, 'Shorten URL is required').optional(),
  })
  .refine(data => Object.keys(data).length > 0, { message: 'At least one field must be updated.' });

// Type inference
export type CreateShortenUrlInput = z.infer<typeof createShortenUrlSchema>;
export type UpdateShortenUrlInput = z.infer<typeof updateShortenUrlSchema>;
