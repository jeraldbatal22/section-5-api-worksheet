import dotenv from 'dotenv';
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  API_URL_EXCHANGE_RATE: process.env.API_URL_EXCHANGE_RATE!,
  API_KEY_EXCHANGE_RATE: process.env.API_KEY_EXCHANGE_RATE!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
  JWT_SECRET: process.env.JWT_SECRET!,
  BASE_URL: process.env.BASE_URL!,
  PG_HOST: process.env.PG_HOST!,
  PG_USER: process.env.PG_USER!,
  PG_PORT: process.env.PG_PORT!,
  PG_PASSWORD: process.env.PG_PASSWORD!,
  PG_DATABASE: process.env.PG_DATABASE!,
  RATE_LIMITER: {
    WINDOW_MS: process.env.RATE_LIMITER_WINDOW_MS!,
    MAX_REQUESTS: process.env.RATE_LIMITER_MAX_REQUESTS!,
  },
  AWS: {
    REGION: process.env.AWS_REGION!,
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  },
  SUPABASE: {
    URL: process.env.SUPABASE_URL!,
    ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
    SECRET_KEY: process.env.SUPABASE_JWT_SECRET!,
  },
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ],
  },
};

export const {
  NODE_ENV,
  PORT,
  API_URL_EXCHANGE_RATE,
  API_KEY_EXCHANGE_RATE,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_SECRET,
  BASE_URL,
  PG_HOST,
  PG_USER,
  PG_PORT,
  PG_PASSWORD,
  PG_DATABASE,
  RATE_LIMITER,
  AWS,
  SUPABASE,
  UPLOAD,
} = config;
