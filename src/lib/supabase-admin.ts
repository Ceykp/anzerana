import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL eksik.");
}

if (!serviceRoleKey) {
  throw new Error("Supabase service role key eksik.");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);