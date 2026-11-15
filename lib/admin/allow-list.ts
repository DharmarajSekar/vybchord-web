/** ADMIN_EMAILS: comma-separated allow-list (tech spec §3). Case-insensitive. Server-only env. */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/** Only same-site admin paths are allowed as post-login redirects (no open redirects). */
export function safeAdminPath(next: string | null | undefined): string {
  return next && /^\/admin(\/|$|\?)/.test(next) && !next.startsWith("//") ? next : "/admin";
}
