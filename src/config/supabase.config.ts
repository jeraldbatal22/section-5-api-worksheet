import { createClient, SupabaseClient } from '@supabase/supabase-js';
import HttpStatusCode from 'http-status';
import { AppError } from '../middlewares/error-handler.middleware';
import { logger } from '../utils/logger.util';
import { SUPABASE } from './env.config';

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
