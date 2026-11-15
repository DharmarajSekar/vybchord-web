import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "At least 2 characters")
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens, e.g. my-product",
  );

/** Optional text: "" is allowed in the form and stored as NULL. */
export const optText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max} characters`);

/** One-per-line lists: trimmed, empty lines dropped. */
export const stringList = (maxItems: number, maxLength: number) =>
  z
    .array(z.string())
    .transform((items) => items.map((item) => item.trim()).filter(Boolean))
    .pipe(
      z
        .array(z.string().max(maxLength, `Keep each item under ${maxLength} characters`))
        .max(maxItems, `Up to ${maxItems} items`),
    );

/** ISO timestamp, or "" for none. */
export const optTimestamp = z.union([z.iso.datetime({ offset: true }), z.literal("")]);

export const seoFields = {
  seo_title: optText(70),
  seo_description: optText(160),
};

export const imageList = (max: number) => z.array(z.string().max(300)).max(max);
