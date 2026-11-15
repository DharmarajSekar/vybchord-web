import "server-only";
import type { Admin } from "./auth";
import type { Enums } from "@/lib/supabase/types";

const COLUMNS =
  "id, created_at, status, name, email, phone, experience_years, notice_period, location, expected_ctc, cv_path, links, skills, job:jobs(id, title)";

/** Applications, newest first, optionally for one job or one status. */
export async function fetchApplications(
  { supabase }: Admin,
  filters: { jobId?: string; status?: Enums<"app_status"> } = {},
) {
  let query = supabase
    .from("applications")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(500);
  if (filters.jobId) query = query.eq("job_id", filters.jobId);
  if (filters.status) query = query.eq("status", filters.status);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load applications: ${error.message}`);
  return data;
}
