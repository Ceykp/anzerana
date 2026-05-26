import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL eksik");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase ANON KEY eksik");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);