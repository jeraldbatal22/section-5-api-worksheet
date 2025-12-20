export interface I_Bookmark {
  id?: string;
  url: string;
  title: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export class BookmarkModel implements I_Bookmark {
  id?: string;
  url!: string;
  title!: string;
  user_id!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_Bookmark) {
    Object.assign(this, data);
  }

  toJSON(): I_Bookmark {
    return { ...this };
  }
}

export default BookmarkModel;
