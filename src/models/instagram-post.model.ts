import { T_InstagramPost, T_MediaType } from '../schemas/instagram.schema';

export class InstagramPostModel implements T_InstagramPost {
  id!: string;
  user_id!: string;
  caption?: string | null;
  url!: string;
  media_type!: T_MediaType;
  created_at?: string;
  updated_at?: string;

  constructor(data: T_InstagramPost) {
    Object.assign(this, data);
  }

  toJSON(): T_InstagramPost {
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
