import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";
import type { Database } from "./types";

/**
 * Service-role client. Bypasses RLS — use only in server actions and admin code paths.
 * The `server-only` import makes any client-side import fail the build.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("Missing env var SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
