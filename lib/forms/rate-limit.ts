import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const LIMIT = 5;
const WINDOW_SECONDS = 10 * 60;

/**
 * Tech spec §4 step 4: 5 submissions per 10 minutes per IP and form.
 * Fails open if the limiter itself errors, so a database hiccup never loses a real lead.
 */
export async function isWithinRateLimit(key: string): Promise<boolean> {
  const { data, error } = await createAdminClient().rpc("hit_rate_limit", {
    p_key: key,
    p_limit: LIMIT,
    p_window_seconds: WINDOW_SECONDS,
  });
  if (error) {
    console.error("[rate-limit] check failed; allowing request", error.message);
    return true;
  }
  return data === true;
}
