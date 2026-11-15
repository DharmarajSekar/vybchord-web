"use server";

import { z } from "zod";
import { adminAction } from "@/lib/admin/action";
import { logAdminAction } from "@/lib/admin/audit";
import { dbError, nullIfEmpty, type AdminResult } from "@/lib/admin/result";
import { revalidateSite } from "@/lib/admin/revalidate";
import {
  caseStudySchema,
  jobSchema,
  postSchema,
  productSchema,
} from "@/lib/validations/admin/content";

const idSchema = z.uuid().nullable();

/** Shared tail of every content save: audit, refresh the public site, report the id. */
async function done(
  actor: string,
  entity: string,
  id: string,
  created: boolean,
  slug: string,
): Promise<AdminResult> {
  await logAdminAction({
    actor,
    action: `${entity}.${created ? "create" : "update"}`,
    entity,
    entityId: id,
    meta: { slug },
  });
  revalidateSite();
  return { ok: true, id, message: created ? "Created" : "Saved" };
}

/** FR-A3 create or update a product. */
export async function saveProduct(id: string | null, input: unknown): Promise<AdminResult> {
  return adminAction(productSchema, input, async ({ supabase, user }, values) => {
    const row = nullIfEmpty(values);
    const targetId = idSchema.parse(id);
    const query = targetId
      ? supabase.from("products").update(row).eq("id", targetId)
      : supabase.from("products").insert(row);
    const { data, error } = await query.select("id").single();
    if (error) return dbError(error, "product");
    return done(user.id, "product", data.id, !targetId, values.slug);
  });
}

/** FR-A4 create or update a case study. */
export async function saveCaseStudy(id: string | null, input: unknown): Promise<AdminResult> {
  return adminAction(caseStudySchema, input, async ({ supabase, user }, values) => {
    const row = nullIfEmpty(values);
    const targetId = idSchema.parse(id);
    const query = targetId
      ? supabase.from("case_studies").update(row).eq("id", targetId)
      : supabase.from("case_studies").insert(row);
    const { data, error } = await query.select("id").single();
    if (error) return dbError(error, "case study");
    return done(user.id, "case_study", data.id, !targetId, values.slug);
  });
}

/** FR-A5 create or update an insights post. Empty publish date = draft; future = scheduled. */
export async function savePost(id: string | null, input: unknown): Promise<AdminResult> {
  return adminAction(postSchema, input, async ({ supabase, user }, values) => {
    const { cover_image, ...rest } = values;
    const row = {
      ...nullIfEmpty(rest),
      body_mdx: values.body_mdx,
      cover_image: cover_image[0] ?? null,
    };
    const targetId = idSchema.parse(id);
    const query = targetId
      ? supabase.from("posts").update(row).eq("id", targetId)
      : supabase.from("posts").insert(row);
    const { data, error } = await query.select("id").single();
    if (error) return dbError(error, "post");
    return done(user.id, "post", data.id, !targetId, values.slug);
  });
}

/** FR-A6 create or update a job. Closing a role is `is_open: false`. */
export async function saveJob(id: string | null, input: unknown): Promise<AdminResult> {
  return adminAction(jobSchema, input, async ({ supabase, user }, values) => {
    const row = { ...nullIfEmpty(values), description_mdx: values.description_mdx };
    const targetId = idSchema.parse(id);
    const query = targetId
      ? supabase.from("jobs").update(row).eq("id", targetId)
      : supabase.from("jobs").insert(row);
    const { data, error } = await query.select("id").single();
    if (error) return dbError(error, "job");
    return done(user.id, "job", data.id, !targetId, values.slug);
  });
}

const deletable = z.object({
  table: z.enum(["products", "case_studies", "posts", "jobs"]),
  id: z.uuid(),
});

/** Deletes a content row. Job applications keep their data (job_id is set to NULL). */
export async function deleteContent(input: unknown): Promise<AdminResult> {
  return adminAction(deletable, input, async ({ supabase, user }, { table, id }) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return dbError(error, table);
    await logAdminAction({
      actor: user.id,
      action: `${table}.delete`,
      entity: table,
      entityId: id,
    });
    revalidateSite();
    return { ok: true, message: "Deleted" };
  });
}
