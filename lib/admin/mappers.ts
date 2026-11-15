import { parseStringRecords } from "@/lib/data/json";
import type { Tables } from "@/lib/supabase/types";
import type {
  CaseStudyInput,
  JobInput,
  PostInput,
  ProductInput,
} from "@/lib/validations/admin/content";

const s = (value: string | null | undefined) => value ?? "";

/** Database rows → edit-form values (NULL becomes "", jsonb becomes typed arrays). */
export function productToForm(row: Tables<"products">): ProductInput {
  return {
    name: row.name,
    slug: row.slug,
    tagline: s(row.tagline),
    summary: s(row.summary),
    problem: s(row.problem),
    domain: s(row.domain),
    status: row.status,
    modules: parseStringRecords(row.modules, ["title", "description"]),
    screenshots: row.screenshots ?? [],
    deployment_options: row.deployment_options ?? [],
    security_notes: row.security_notes ?? [],
    faqs: parseStringRecords(row.faqs, ["question", "answer"]),
    seo_title: s(row.seo_title),
    seo_description: s(row.seo_description),
    sort_order: row.sort_order ?? 0,
    published: row.published,
  };
}

export function caseStudyToForm(row: Tables<"case_studies">): CaseStudyInput {
  return {
    title: row.title,
    slug: row.slug,
    client_name: s(row.client_name),
    anonymised: row.anonymised,
    industry: s(row.industry),
    line: row.line,
    challenge: s(row.challenge),
    solution: s(row.solution),
    outcome: s(row.outcome),
    stack: row.stack ?? [],
    images: row.images ?? [],
    seo_title: s(row.seo_title),
    seo_description: s(row.seo_description),
    published: row.published,
  };
}

export function postToForm(row: Tables<"posts">): PostInput {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: s(row.excerpt),
    body_mdx: row.body_mdx,
    cover_image: row.cover_image ? [row.cover_image] : [],
    category: s(row.category),
    tags: row.tags ?? [],
    author: s(row.author),
    published_at: s(row.published_at),
    seo_title: s(row.seo_title),
    seo_description: s(row.seo_description),
  };
}

export function jobToForm(row: Tables<"jobs">): JobInput {
  const mode = row.work_mode ?? "";
  return {
    title: row.title,
    slug: row.slug,
    type: row.type,
    location: s(row.location),
    work_mode: (["Remote", "Onsite", "Hybrid"].includes(mode) ? mode : "") as JobInput["work_mode"],
    experience: s(row.experience),
    description_mdx: row.description_mdx,
    skills: row.skills ?? [],
    is_open: row.is_open,
    valid_through: s(row.valid_through),
  };
}

/** Post state shown in lists: draft, scheduled or published. */
export function postState(publishedAt: string | null): { live: boolean; label: string } {
  if (!publishedAt) return { live: false, label: "Draft" };
  return new Date(publishedAt) > new Date()
    ? { live: false, label: "Scheduled" }
    : { live: true, label: "Published" };
}
