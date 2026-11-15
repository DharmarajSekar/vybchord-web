import { z } from "zod";
import { Constants } from "@/lib/supabase/types";
import { imageList, optText, optTimestamp, seoFields, slugSchema, stringList } from "./shared";

const { business_line, job_type, product_status } = Constants.public.Enums;

const pair = <A extends string, B extends string>(a: A, b: B, aLabel: string, bLabel: string) =>
  z.object({
    [a]: z.string().trim().min(1, `Add a ${aLabel}`).max(160),
    [b]: z.string().trim().min(1, `Add a ${bLabel}`).max(1000),
  } as Record<A | B, z.ZodString>);

/** FR-A3 product editor. */
export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(120),
  slug: slugSchema,
  tagline: optText(160),
  summary: optText(600),
  problem: optText(2000),
  domain: optText(80),
  status: z.enum(product_status),
  modules: z.array(pair("title", "description", "title", "description")).max(30),
  screenshots: imageList(20),
  deployment_options: stringList(10, 60),
  security_notes: stringList(20, 200),
  faqs: z.array(pair("question", "answer", "question", "answer")).max(30),
  ...seoFields,
  sort_order: z.coerce.number().int().min(0).max(999),
  published: z.boolean(),
});

/** FR-A4 case study editor. */
export const caseStudySchema = z.object({
  title: z.string().trim().min(2, "Enter a title").max(160),
  slug: slugSchema,
  client_name: optText(120),
  anonymised: z.boolean(),
  industry: optText(80),
  line: z.enum(business_line),
  challenge: optText(3000),
  solution: optText(3000),
  outcome: optText(3000),
  stack: stringList(30, 60),
  images: imageList(20),
  ...seoFields,
  published: z.boolean(),
});

/** FR-A5 insights editor. An empty publish date keeps the post as a draft; a future one schedules it. */
export const postSchema = z.object({
  title: z.string().trim().min(2, "Enter a title").max(160),
  slug: slugSchema,
  excerpt: optText(300),
  body_mdx: z.string().max(100_000, "The article is too long"),
  cover_image: imageList(1),
  category: optText(60),
  tags: stringList(15, 40),
  author: optText(80),
  published_at: optTimestamp,
  ...seoFields,
});

/** FR-A6 job editor. Unticking "Open" closes the role. */
export const jobSchema = z.object({
  title: z.string().trim().min(2, "Enter a title").max(120),
  slug: slugSchema,
  type: z.enum(job_type),
  location: optText(80),
  work_mode: z.union([z.enum(["Remote", "Onsite", "Hybrid"]), z.literal("")]),
  experience: optText(60),
  description_mdx: z
    .string()
    .trim()
    .min(20, "Describe the role (at least 20 characters)")
    .max(50_000),
  skills: stringList(30, 40),
  is_open: z.boolean(),
  valid_through: optTimestamp,
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductValues = z.output<typeof productSchema>;
export type CaseStudyInput = z.input<typeof caseStudySchema>;
export type CaseStudyValues = z.output<typeof caseStudySchema>;
export type PostInput = z.input<typeof postSchema>;
export type PostValues = z.output<typeof postSchema>;
export type JobInput = z.input<typeof jobSchema>;
export type JobValues = z.output<typeof jobSchema>;
