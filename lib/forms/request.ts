import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** Client IP from the reverse proxy (Hostinger / nginx sets X-Forwarded-For). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

/** IPs are only stored hashed (rate-limit keys), never in clear text. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
