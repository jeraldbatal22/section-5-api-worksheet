import { Request } from 'express';

type T_Role = 'pro' | 'basic' | 'admin';

export interface I_AuthUser {
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

export interface I_AuthRequest extends Request {
  user?: I_AuthUser;
  file?: any;
}

export interface I_User {
  id: string;
  username: string;
  avatar_url?: string | null;
  role: T_Role;
  created_at?: string;
  updated_at?: string;
}

export class UserModel implements I_User {
  id!: string;
  username!: string;
  avatar_url?: string | null;
  role!: T_Role;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_User) {
    Object.assign(this, data);
  }

  toJSON(): I_User {
    return {
      id: this.id,
      username: this.username,
      avatar_url: this.avatar_url,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
