import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Graceful lazy/conditional initialization to prevent crashes on startup if env keys are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    console.warn(
      "[Supabase] Client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present in your environment."
    );
  }
  return supabase;
}
