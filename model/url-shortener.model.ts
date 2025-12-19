export interface UrlShortener {
  id?: number;
  user_id: number | string;
  url: string;
  shorten_url: string;
  created_at?: string;
  updated_at?: string;
}

export class UrlShortenerModel implements UrlShortener {
  id?: number;
  user_id!: number | string;
  url!: string;
  shorten_url!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: UrlShortener) {
    Object.assign(this, data);
  }

  toJSON(): UrlShortener {
    return { ...this };
  }
}

export default UrlShortenerModel;
