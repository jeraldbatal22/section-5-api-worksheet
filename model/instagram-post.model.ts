import type { IInstagramPost, MediaType } from '../schemas/instagram.schema.ts';

export class InstagramPostModel implements IInstagramPost {
  id!: string;
  user_id!: string;
  caption?: string | null;
  url!: string;
  media_type!: MediaType;
  created_at?: string;
  updated_at?: string;

  constructor(data: IInstagramPost) {
    Object.assign(this, data);
  }

  toJSON(): IInstagramPost {
    return {
      id: this.id,
      user_id: this.user_id,
      caption: this.caption,
      url: this.url,
      media_type: this.media_type,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
