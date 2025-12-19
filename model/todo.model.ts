export interface ITodo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export class TodoModel implements ITodo {
  id!: number;
  user_id!: number;
  title!: string;
  description!: string | null;
  is_completed!: boolean;
  created_at?: string;
  updated_at?: string;

  constructor(data: ITodo) {
    Object.assign(this, data);
  }

  toJSON(): ITodo {
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
