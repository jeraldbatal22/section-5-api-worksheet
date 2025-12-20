export interface I_UrlShortener {
  id?: number;
  user_id: number | string;
  url: string;
  shorten_url: string;
  created_at?: string;
  updated_at?: string;
}

export class UrlShortenerModel implements I_UrlShortener {
  id?: number;
  user_id!: number | string;
  url!: string;
  shorten_url!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_UrlShortener) {
    Object.assign(this, data);
  }

  toJSON(): I_UrlShortener {
    return { ...this };
  }
}

export default UrlShortenerModel;
