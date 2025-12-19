import type { Request } from "express";

type T_Role = "pro" | "basic" | "admin";

interface IAuthUser {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email_verified: boolean;
    [key: string]: any;
  };
  role: T_Role;
  aal: string;
  amr: { method: string; timestamp: number }[];
  session_id: string;
  is_anonymous: boolean;
  id: string | number;
}

interface IAuthRequest extends Request {
  user?: IAuthUser;
}

type T_Session = {
  token: string;
  expiresAt: number;
};

type T_Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

type T_Pokemon = {
  id: string;
  name: string;
  type: string;
  level: number;
  abilities: string[];
  createdAt: string;
};

// Types
type T_Message = {
  id: string;
  content: string;
  sender?: string;
  createdAt: string;
  fileId?: string; // Optional file reference
};

type T_File = {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
};

// Supported currencies as a union type and constant object
type T_Currency = "PHP" | "USD" | "JPY";

const Currency = {
  PHP: "PHP" as T_Currency,
  USD: "USD" as T_Currency,
  JPY: "JPY" as T_Currency,
};

export {
  type T_Todo,
  type T_Currency,
  Currency,
  type T_Session,
  type T_Pokemon,
  type T_Message,
  type T_File,
  type IAuthUser,
  type IAuthRequest,
};
