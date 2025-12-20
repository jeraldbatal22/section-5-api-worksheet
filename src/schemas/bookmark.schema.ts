import { z } from 'zod';

// Bookmark creation schema
export const createBookmarkSchema = z.object({
  url: z.url('URL must be valid'),
  title: z.string().min(1, 'Title is required'),
  caption: z.string().nullable().optional(),
});

// Bookmark update schema
export const updateBookmarkSchema = z
  .object({
    url: z.url('URL must be valid').optional(),
    title: z.string().min(1, 'Title is required').optional(),
    caption: z.string().nullable().optional(),
  })
  .refine(data => Object.keys(data).length > 0, { message: 'At least one field must be updated.' });

// Type inference
export type T_CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type T_UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
