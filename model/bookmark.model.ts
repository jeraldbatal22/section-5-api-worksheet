export interface Bookmark {
  // Reference: same shape as IChat but rename fields appropriately or as needed
  id?: string;
  url: string;
  title: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookmarkDTO {
  url: string;
  title: string;
}

export interface UpdateBookmarkDTO {
  url?: string;
  title?: string;
}

// For demonstration only: analogous to ChatModel,
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