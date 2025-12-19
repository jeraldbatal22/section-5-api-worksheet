export interface Bookmark {
  id?: string;
  url: string;
  title: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export class BookmarkModel implements Bookmark {
  id?: string;
  url!: string;
  title!: string;
  user_id!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: Bookmark) {
    Object.assign(this, data);
  }

  toJSON(): Bookmark {
    return { ...this };
  }
}

export default BookmarkModel;
