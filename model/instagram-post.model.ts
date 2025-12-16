// Enum for supported media types
export type MediaType = "image" | "video" | null;

export interface IInstagramPost {
  id: string;
  user_id: string;
  caption?: string | null;
  url: string;
  media_type: MediaType;
  created_at?: string;
  updated_at?: string;
}

// DTO for creating an Instagram post
export interface CreateInstagramPostDTO {
  user_id: string;
  caption?: string | null;
  file?: any;
  uploadTo?: "aws-s3" | "supabase-storage";
  // media_type: MediaType;
}

// DTO for updating an Instagram post
export interface UpdateInstagramPostDTO {
  caption?: string | null;
  url?: string;
  media_type?: MediaType;
}

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
