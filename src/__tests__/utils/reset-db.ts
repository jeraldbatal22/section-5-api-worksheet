import { getSupabaseDatabase } from '../../config/supabase.config';

export async function resetDb(tableName: string) {
  // if (process.env.NODE_ENV !== "test") {
  //   throw new Error("resetDb only allowed in test env");
  // }
  const supabase = getSupabaseDatabase();

  const { error } = await supabase.rpc(tableName);

  if (error) throw error;
}
