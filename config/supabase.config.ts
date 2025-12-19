import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from './env.config.ts';
import { logger } from '../utils/logger.utils.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import HttpStatusCode from 'http-status';

let supabase: SupabaseClient | null = null;

export const initializeSupabaseDatabase = (): SupabaseClient => {
  if (!SUPABASE.URL || !SUPABASE.SERVICE_KEY) {
    throw new AppError(HttpStatusCode.BAD_REQUEST, 'Missing Supabase configuration');
  }

  supabase = createClient(SUPABASE.URL, SUPABASE.SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  logger.info('Supabase client initialized');
  return supabase;
};

export const getSupabaseDatabase = (): SupabaseClient => {
  if (!supabase) {
    return initializeSupabaseDatabase();
  }
  return supabase;
};
