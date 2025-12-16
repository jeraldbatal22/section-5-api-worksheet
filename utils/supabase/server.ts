import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE } from "../../config/env.ts";

// Initialize supabase admin client (Service Role Key needed for JWT validation)
const supabase = createClient(
  SUPABASE.URL,
  SUPABASE.SERVICE_KEY // Use service key for backend operations
) as SupabaseClient;

export default supabase;