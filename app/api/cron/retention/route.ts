import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { runRetention } from "@/lib/admin/retention";

function authorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!secret || secret.length < 32) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * NFR-6 daily retention for a scheduled job (e.g. Hostinger cron):
 *   curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/retention
 * Disabled unless CRON_SECRET (32+ characters) is set.
 */
export async function POST(request: NextRequest) {
  if (!authorised(request)) return new Response("Not found", { status: 404 });
  try {
    const result = await runRetention(null);
    return Response.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[cron] retention failed", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
