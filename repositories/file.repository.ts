// // repositories/file.repository.ts
// import { SupabaseClient } from '@supabase/supabase-js';
// import  { FileModel, type IFile } from '../model/file.model.ts';

// export class FileRepository {
//   private supabase: any;
//   constructor() {
//     this.supabase = SupabaseClient
//   }

//   async create(fileData: IFile): Promise<FileModel> {
//     // const filePath = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "_")}`;

//     // const { error } = await supabase.storage
//     //   .from("google-drive-images")
//     //   .upload(filePath, file);
//     // if (error) showToast(error.message, "error");

//     // const { data } = supabase.storage
//     //   .from("google-drive-images")
//     //   .getPublicUrl(filePath);
//     const { data, error } = await this.supabase
//       .from('files')
//       .insert(fileData)
//       .select()
//       .single();

//     if (error) throw new Error(`Database error: ${error.message}`);
//     return new FileModel(data);
//   }

//   async findById(id: string): Promise<FileModel | null> {
//     const { data, error } = await this.supabase
//       .from('files')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) {
//       if (error.code === 'PGRST116') return null;
//       throw new Error(`Database error: ${error.message}`);
//     }
//     return new FileModel(data);
//   }

//   async findByKey(key: string): Promise<FileModel | null> {
//     const { data, error } = await this.supabase
//       .from('files')
//       .select('*')
//       .eq('key', key)
//       .single();

//     if (error) {
//       if (error.code === 'PGRST116') return null;
//       throw new Error(`Database error: ${error.message}`);
//     }
//     return new FileModel(data);
//   }

//   async findByEntity(entityType: string, entityId: string): Promise<FileModel[]> {
//     const { data, error } = await this.supabase
//       .from('files')
//       .select('*')
//       .eq('entity_type', entityType)
//       .eq('entity_id', entityId);

//     if (error) throw new Error(`Database error: ${error.message}`);
//     return data.map(f => new FileModel(f));
//   }

//   async findByUser(userId: string): Promise<FileModel[]> {
//     const { data, error } = await this.supabase
//       .from('files')
//       .select('*')
//       .eq('uploaded_by', userId);

//     if (error) throw new Error(`Database error: ${error.message}`);
//     return data.map(f => new FileModel(f));
//   }

//   async update(id: string, updates: Partial<IFile>): Promise<FileModel> {
//     const { data, error } = await this.supabase
//       .from('files')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) throw new Error(`Database error: ${error.message}`);
//     return new FileModel(data);
//   }

//   async delete(id: string): Promise<void> {
//     const { error } = await this.supabase
//       .from('files')
//       .delete()
//       .eq('id', id);

//     if (error) throw new Error(`Database error: ${error.message}`);
//   }
// }
