import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";
import type { Database } from "./types";

let warned = false;

/**
 * Anonymous, cookie-less client for public content reads. It never touches request cookies,
 * so pages using it stay static (SSG/ISR). RLS limits it to published rows.
 *
 * Returns null when Supabase env vars are not set (fresh local checkout), so pages render
 * without database content instead of failing. A warning is logged once.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) {
    if (!warned) {
      console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY not set; rendering without data.");
      warned = true;
    }
    return null;
  }
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export type PublicClient = NonNullable<ReturnType<typeof createPublicClient>>;
