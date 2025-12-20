import dotenv from "dotenv";
dotenv.config();

interface I_RateLimiterConfig {
  WINDOW_MS: string;
  MAX_REQUESTS: string;
}

interface I_AwsConfig {
  REGION: string;
  ACCESS_KEY_ID: string;
  SECRET_ACCESS_KEY: string;
  S3_BUCKET_NAME: string;
}

interface I_SupabaseConfig {
  URL: string;
  ANON_KEY: string;
  SERVICE_KEY: string;
  SECRET_KEY: string;
}

interface I_UploadConfig {
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
}

interface I_PgConfig {
  HOST: string;
  USER: string;
  PORT: string;
  PASSWORD: string;
  DATABASE: string;
}

interface I_JwtConfig {
  EXPIRES_IN: string;
  REFRESH_EXPIRES_IN: string;
  SECRET: string;
}

interface I_ExchangeRate {
  API_URL: string;
  API_KEY: string;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  EXCHANGE_RATE: I_ExchangeRate;
  JWT: I_JwtConfig;
  API_BASE_URL: string;
  PG: I_PgConfig;
  RATE_LIMITER: I_RateLimiterConfig;
  AWS: I_AwsConfig;
  SUPABASE: I_SupabaseConfig;
  UPLOAD: I_UploadConfig;
}

interface I_JwtConfig {
  EXPIRES_IN: string;
  REFRESH_EXPIRES_IN: string;
  SECRET: string;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV! || "development",
  PORT: Number(process.env.PORT!) || 3000,
  API_BASE_URL: process.env.BASE_URL!,
  EXCHANGE_RATE: {
    API_URL: process.env.EXCHANGE_RATE_API_URL!,
    API_KEY: process.env.EXCHANGE_RATE_API_KEY!,
  },
  JWT: {
    EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
    SECRET: process.env.JWT_SECRET!,
  },
  PG: {
    HOST: process.env.PG_HOST!,
    USER: process.env.PG_USER!,
    PORT: process.env.PG_PORT!,
    PASSWORD: process.env.PG_PASSWORD!,
    DATABASE: process.env.PG_DATABASE!,
  },
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
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ],
  },
};

export const {
  NODE_ENV,
  PORT,
  EXCHANGE_RATE,
  JWT,
  API_BASE_URL,
  PG,
  RATE_LIMITER,
  AWS,
  SUPABASE,
  UPLOAD,
} = config;
