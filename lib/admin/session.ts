"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isWithinRateLimit } from "@/lib/forms/rate-limit";
import { getClientIp, hashIp } from "@/lib/forms/request";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loginSchema } from "@/lib/validations/admin/login";
import { isAllowedAdminEmail, safeAdminPath } from "./allow-list";
import { getAdmin } from "./auth";
import { logAdminAction } from "./audit";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

const SENT: LoginState = {
  status: "sent",
  message:
    "If this email is registered as an admin, a sign-in link is on its way. It expires in one hour.",
};

async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}

/**
 * FR-A magic-link login. Links are only sent to ADMIN_EMAILS, but the response is the same either
 * way, so the form does not reveal who the admins are.
 */
export async function requestMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };
  if (!isSupabaseConfigured())
    return { status: "error", message: "Sign-in is not configured yet." };

  if (!(await isWithinRateLimit(`login:${hashIp(await getClientIp())}`))) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a few minutes and try again.",
    };
  }

  const { email, next } = parsed.data;
  if (!isAllowedAdminEmail(email)) return SENT;

  const callback = new URL("/auth/callback", await siteOrigin());
  callback.searchParams.set("next", safeAdminPath(next));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callback.toString(), shouldCreateUser: true },
  });
  if (error) console.error("[admin] magic link failed", error.message);
  return SENT;
}

export async function signOut() {
  const admin = await getAdmin();
  if (admin) await logAdminAction({ actor: admin.user.id, action: "auth.sign_out" });
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
