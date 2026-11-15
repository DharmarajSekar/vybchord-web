import "server-only";
import { cache } from "react";
import { createPublicClient, type PublicClient } from "@/lib/supabase/public";
import type { Enums, Tables } from "@/lib/supabase/types";

type JobRow = Tables<"jobs">;
export type JobType = Enums<"job_type">;

export type Job = Omit<JobRow, "skills"> & { skills: string[] };
export type JobSummary = Omit<Job, "description_mdx" | "created_at" | "updated_at">;

const SUMMARY_COLUMNS =
  "id, slug, title, type, location, work_mode, experience, skills, is_open, posted_at, valid_through";

/** Open jobs whose `valid_through` has not passed. */
function openJobs<Columns extends string>(supabase: PublicClient, columns: Columns) {
  return supabase
    .from("jobs")
    .select(columns)
    .eq("is_open", true)
    .or(`valid_through.is.null,valid_through.gt.${new Date().toISOString()}`);
}

/** Open jobs, newest first. Filter by type/location in the UI or with `filterJobs`. */
export const getJobs = cache(async (): Promise<JobSummary[]> => {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await openJobs(supabase, SUMMARY_COLUMNS).order("posted_at", {
    ascending: false,
  });
  if (error) throw new Error(`Failed to load jobs: ${error.message}`);
  return data.map((job) => ({ ...job, skills: job.skills ?? [] }));
});

export type JobFilters = { type?: JobType; location?: string; query?: string };

export function filterJobs(jobs: JobSummary[], { type, location, query }: JobFilters) {
  const q = query?.trim().toLowerCase();
  return jobs.filter(
    (job) =>
      (!type || job.type === type) &&
      (!location || job.location === location) &&
      (!q ||
        job.title.toLowerCase().includes(q) ||
        job.skills.some((skill) => skill.toLowerCase().includes(q))),
  );
}

export const getJobBySlug = cache(async (slug: string): Promise<Job | null> => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await openJobs(supabase, "*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load job "${slug}": ${error.message}`);
  return data ? { ...data, skills: data.skills ?? [] } : null;
});

export async function getJobSlugs(): Promise<string[]> {
  const jobs = await getJobs();
  return jobs.map((job) => job.slug);
}
