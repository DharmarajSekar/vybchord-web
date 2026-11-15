import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedAdminEmail, safeAdminPath } from "@/lib/admin/allow-list";
import { logAdminAction } from "@/lib/admin/audit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function origin(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
}

/**
 * Magic-link landing. Exchanges the link for a session, re-checks the ADMIN_EMAILS allow-list,
 * then registers the user in `admins` (what RLS's is_admin() reads) and opens the admin panel.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeAdminPath(params.get("next"));
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/auth/login?error=${reason}`, origin(request)));

  const supabase = await createClient();
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };
  if (error) return fail("link");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAllowedAdminEmail(user.email)) {
    await supabase.auth.signOut();
    return fail("denied");
  }

  const { error: upsertError } = await createAdminClient()
    .from("admins")
    .upsert({ user_id: user.id, email: user.email }, { onConflict: "user_id" });
  if (upsertError) {
    console.error("[admin] could not register admin", upsertError.message);
    return fail("setup");
  }

  await logAdminAction({ actor: user.id, action: "auth.sign_in" });
  return NextResponse.redirect(new URL(next, origin(request)));
}
