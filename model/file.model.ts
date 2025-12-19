// models/file.model.ts
// TypeScript enum replaced with a plain object to support strip-only mode
export const FileEntityType = {
  CHAT: 'chat',
  USER_AVATAR: 'user_avatar',
  USER_DOCUMENT: 'user_document',
  ATTACHMENT: 'attachment',
  INSTAGRAM_POST: 'instagram',
  OTHER: 'other',
} as const;
export type FileEntityType = (typeof FileEntityType)[keyof typeof FileEntityType];

export interface IFile {
  id?: string;
  key: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploaded_by: string;
  entity_type: FileEntityType;
  entity_id: string;
  created_at?: string;
  updated_at?: string;
}

export class FileModel implements IFile {
  id?: string;
  key!: string;
  url!: string;
  name!: string;
  type!: string;
  size!: number;
  uploaded_by!: string;
  entity_type!: FileEntityType;
  entity_id!: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: IFile) {
    Object.assign(this, data);
  }

  toJSON(): IFile {
    return { ...this };
  }
}
