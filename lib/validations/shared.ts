import { z } from "zod";

// Our CSP blocks eval; without this, zod probes new Function() and every form page logs a CSP
// violation (NFR-5). Imported by every schema, so it applies before any parsing.
z.config({ jitless: true });

/** Hidden field bots fill in and people never see (tech spec §4 step 2). */
export const HONEYPOT_FIELD = "website";
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(120, "Name is too long");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .pipe(z.email("Enter a valid email address"));

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number, e.g. +91 98765 43210");

/** Optional free text: empty strings become undefined. */
export function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .optional()
    .transform((value) => value || undefined);
}

export function optionalChoice<T extends [string, ...string[]]>(choices: T) {
  return z
    .union([z.enum(choices), z.literal("")])
    .optional()
    .transform((value) => value || undefined);
}

export const optionalPhone = z
  .union([phoneSchema, z.literal("")])
  .optional()
  .transform((value) => value || undefined);

export const optionalUrl = z
  .union([
    z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }),
    z.literal(""),
  ])
  .optional()
  .transform((value) => value || undefined);

/** NFR-6: purpose-specific consent. Accepts the checkbox value from the UI or FormData. */
export const consentSchema = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.literal(true, { error: "Please agree so we can respond to your request" }),
);

const isFileList = (value: unknown): value is FileList =>
  typeof FileList !== "undefined" && value instanceof FileList;

export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx"] as const;
export const DOCUMENT_ACCEPT = ".pdf,.doc,.docx";

function documentFile(maxMb: number, requiredMessage: string) {
  return z
    .instanceof(File, { error: requiredMessage })
    .refine((f) => f.size <= maxMb * 1024 * 1024, `File must be ${maxMb} MB or smaller`)
    .refine(
      (f) => DOCUMENT_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(`.${ext}`)),
      "Upload a PDF or Word document (.pdf, .doc, .docx)",
    );
}

/** A FileList (browser) or File (FormData); empty file inputs become undefined. */
function firstFile(value: unknown) {
  const f = isFileList(value) ? value[0] : value;
  return f instanceof File && f.size > 0 ? f : undefined;
}

export function requiredDocument(maxMb: number, requiredMessage: string) {
  return z.preprocess(firstFile, documentFile(maxMb, requiredMessage));
}

export function optionalDocument(maxMb: number) {
  return z.preprocess(firstFile, documentFile(maxMb, "Invalid file").optional());
}
