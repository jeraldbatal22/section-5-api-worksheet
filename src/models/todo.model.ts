export interface I_Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export class TodoModel implements I_Todo {
  id!: number;
  user_id!: number;
  title!: string;
  description!: string | null;
  is_completed!: boolean;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_Todo) {
    Object.assign(this, data);
  }

  toJSON(): I_Todo {
    return {
      id: this.id,
      user_id: this.user_id,
      title: this.title,
      description: this.description,
      is_completed: this.is_completed,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
