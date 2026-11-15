import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "./audit";

const DAY = 86_400_000;
export const CV_RETENTION_MONTHS = 12;

function monthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
}

export type RetentionResult = {
  applications: number;
  files: number;
  rateLimits: number;
  unconfirmedSubscribers: number;
};

/**
 * NFR-6 retention, as stated in the Privacy Policy:
 * - job applications and CVs: deleted 12 months after applying;
 * - spam-protection (rate-limit) records: deleted after a day;
 * - newsletter sign-ups never confirmed: deleted after 30 days.
 * Runs with the service role (storage deletes are not allowed for admins via RLS). Idempotent.
 */
export async function runRetention(actor: string | null): Promise<RetentionResult> {
  const supabase = createAdminClient();

  const { data: expired, error } = await supabase
    .from("applications")
    .select("id, cv_path")
    .lt("created_at", monthsAgo(CV_RETENTION_MONTHS))
    .limit(1000);
  if (error) throw new Error(`Retention: could not list applications: ${error.message}`);

  let files = 0;
  const paths = (expired ?? []).map((a) => a.cv_path).filter(Boolean);
  if (paths.length) {
    const { data: removed, error: storageError } = await supabase.storage
      .from("uploads")
      .remove(paths);
    if (storageError) throw new Error(`Retention: could not delete CVs: ${storageError.message}`);
    files = removed?.length ?? 0;
  }
  if (expired?.length) {
    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .in(
        "id",
        expired.map((a) => a.id),
      );
    if (deleteError)
      throw new Error(`Retention: could not delete applications: ${deleteError.message}`);
  }

  const { count: rateLimits } = await supabase
    .from("rate_limits")
    .delete({ count: "exact" })
    .lt("window_start", new Date(Date.now() - DAY).toISOString());

  const { count: unconfirmedSubscribers } = await supabase
    .from("leads")
    .delete({ count: "exact" })
    .eq("form_type", "newsletter")
    .eq("payload->>confirmed", "false")
    .lt("created_at", new Date(Date.now() - 30 * DAY).toISOString());

  const result = {
    applications: expired?.length ?? 0,
    files,
    rateLimits: rateLimits ?? 0,
    unconfirmedSubscribers: unconfirmedSubscribers ?? 0,
  };
  await logAdminAction({ actor, action: "retention.run", entity: "system", meta: result });
  return result;
}

/** Applications that the next retention run will delete (for the dashboard). */
export function retentionCutoff(): string {
  return monthsAgo(CV_RETENTION_MONTHS);
}
