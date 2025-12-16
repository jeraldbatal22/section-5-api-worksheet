export interface IChat {
  id?: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class ChatModel implements IChat {
  id?: string;
  content!: string;
  sender_id!: string;
  file_url?: string;
  receiver_id!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: IChat) {
    Object.assign(this, data);
  }

  toJSON(): IChat {
    return { ...this };
  }
}