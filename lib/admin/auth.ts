import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAllowedAdminEmail } from "./allow-list";

/**
 * The signed-in admin, or null. Requires all three: a valid Supabase session, an email on the
 * ADMIN_EMAILS allow-list, and a row in `admins` (which is what RLS's is_admin() checks).
 * Queries made with the returned client run as that user, so RLS still applies.
 */
export const getAdmin = cache(async () => {
  // Always per-request: auth must never be decided at build time or served from a cache.
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAllowedAdminEmail(user.email)) return null;

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;
  return { supabase, user: { id: user.id, email: user.email } };
});

export type Admin = NonNullable<Awaited<ReturnType<typeof getAdmin>>>;

/** For admin pages: redirects to the login page when there is no admin session. */
export async function requireAdmin(next = "/admin"): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  return admin;
}
