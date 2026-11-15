import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Enums, Tables } from "@/lib/supabase/types";

type CaseStudyRow = Tables<"case_studies">;
export type BusinessLine = Enums<"business_line">;

export type CaseStudy = Omit<CaseStudyRow, "stack" | "images"> & {
  stack: string[];
  images: string[];
};

export type CaseStudySummary = Pick<
  CaseStudyRow,
  "id" | "slug" | "title" | "client_name" | "anonymised" | "industry" | "line" | "outcome"
> & { image: string | null; stack: string[] };

const SUMMARY_COLUMNS =
  "id, slug, title, client_name, anonymised, industry, line, outcome, images, stack";

/** Published case studies, newest first, optionally filtered by business line and industry. */
export const getCaseStudies = cache(
  async (line?: BusinessLine, industry?: string): Promise<CaseStudySummary[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];

    let query = supabase
      .from("case_studies")
      .select(SUMMARY_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (line) query = query.eq("line", line);
    if (industry) query = query.eq("industry", industry);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to load case studies: ${error.message}`);
    return data.map(({ images, stack, ...rest }) => ({
      ...rest,
      image: images?.[0] ?? null,
      stack: stack ?? [],
    }));
  },
);

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudy | null> => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load case study "${slug}": ${error.message}`);
  return data ? { ...data, stack: data.stack ?? [], images: data.images ?? [] } : null;
});

/** Distinct industries across published case studies, for the filter UI. */
export async function getCaseStudyIndustries(): Promise<string[]> {
  const studies = await getCaseStudies();
  const industries = studies.map((study) => study.industry).filter((i): i is string => Boolean(i));
  return [...new Set(industries)].sort();
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const studies = await getCaseStudies();
  return studies.map((study) => study.slug);
}

/** Project case studies ranked by stack overlap (case-insensitive), then recency. */
export async function getRelatedCaseStudies(
  stack: string[],
  limit = 3,
): Promise<CaseStudySummary[]> {
  const wanted = new Set(stack.map((item) => item.toLowerCase()));
  const overlap = (study: CaseStudySummary) =>
    study.stack.filter((item) => wanted.has(item.toLowerCase())).length;

  const studies = await getCaseStudies("services");
  return studies
    .map((study, index) => ({ study, index, score: overlap(study) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ study }) => study);
}
