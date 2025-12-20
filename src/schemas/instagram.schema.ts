import { z } from 'zod';

// Enum for supported media types
export const MediaTypeEnum = z.enum(['image', 'video']);
export type T_MediaType = z.infer<typeof MediaTypeEnum> | null;

// Zod schema for Instagram Post
export const instagramPostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  caption: z.string().nullable().optional(),
  url: z.string(),
  media_type: MediaTypeEnum.nullable(), // 'image' | 'video' | null
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type T_InstagramPost = z.infer<typeof instagramPostSchema>;

// DTO for creating an Instagram post with zod
export const createInstagramPostSchema = z.object({
  user_id: z.string(),
  caption: z.string().nullable().optional(),
  file: z.any().optional(),
  uploadTo: z.enum(['aws-s3', 'supabase-storage']).optional(),
  // media_type is omitted in  like in the TS interface
});
export type T_CreateInstagramPost = z.infer<typeof createInstagramPostSchema>;

// DTO for updating an Instagram post
export const updateInstagramPostSchema = z.object({
  caption: z.string().nullable().optional(),
  url: z.string().optional(),
  media_type: MediaTypeEnum.nullable().optional(),
});
export type T_UpdateInstagramPost = z.infer<typeof updateInstagramPostSchema>;
