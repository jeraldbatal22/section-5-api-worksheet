import supabase from "../../utils/supabase/server";

export async function resetDb(tableName: string) {
  // if (process.env.NODE_ENV !== "test") {
  //   throw new Error("resetDb only allowed in test env");
  // }

  const { error } = await supabase.rpc(tableName);

  if (error) throw error;
}
