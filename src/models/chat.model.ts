export interface I_Chat {
  id?: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class ChatModel implements I_Chat {
  id?: string;
  content!: string;
  sender_id!: string;
  file_url?: string;
  receiver_id!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_Chat) {
    Object.assign(this, data);
  }

  toJSON(): I_Chat {
    return { ...this };
  }
}
