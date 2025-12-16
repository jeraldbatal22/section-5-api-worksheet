export interface IUser {
  id: string;
  username: string;
  avatar_url?: string | null;
  role: "user" | "admin";
  created_at?: string;
  updated_at?: string;
}

export class UserModel implements IUser {
  id!: string;
  username!: string;
  avatar_url?: string | null;
  role!: "user" | "admin";
  created_at?: string;
  updated_at?: string;

  constructor(data: IUser) {
    Object.assign(this, data);
  }

  toJSON(): IUser {
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
