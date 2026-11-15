import { connection } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * NFR-7 uptime check for monitoring (UptimeRobot, Hostinger, etc.).
 * 200 when the app and database respond, 503 otherwise. Exposes no details.
 */
export async function GET() {
  await connection();
  const supabase = createPublicClient();
  let database = false;
  if (supabase) {
    const { error } = await supabase
      .from("site_settings")
      .select("id", { head: true })
      .abortSignal(AbortSignal.timeout(3000));
    database = !error;
  }
  return Response.json(
    { status: database ? "ok" : "degraded" },
    { status: database ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
