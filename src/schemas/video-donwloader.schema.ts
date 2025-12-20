import { z } from 'zod';

// Zod validation schema for video downloader
export const videoDownloaderSchema = z.object({
  url: z.url('Must be a valid URL').min(1, 'URL is required'),
});

// Type inference
export type T_VideoDownloaderInput = z.infer<typeof videoDownloaderSchema>;
