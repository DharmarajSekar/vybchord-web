import "server-only";
import type { z } from "zod";
import type { ActionResult } from "./types";

/** FormData → plain object. Keys listed in `arrays` keep every value; others keep the last. */
export function formDataToObject(formData: FormData, arrays: string[] = []) {
  const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const key of new Set(formData.keys())) {
    result[key] = arrays.includes(key) ? formData.getAll(key) : formData.get(key)!;
  }
  return result;
}

/** Turns zod issues into one message per top-level field, for the form UI. */
export function validationError(error: z.ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** FRD §4 rule 2: page and campaign the visitor came from, sanitised. */
export function readAttribution(formData: FormData) {
  const page = String(formData.get("source_page") ?? "");
  const source_page = page.startsWith("/") ? page.slice(0, 300) : null;

  const utm: Record<string, string> = {};
  try {
    const raw = JSON.parse(String(formData.get("utm") ?? "{}")) as Record<string, unknown>;
    for (const key of UTM_KEYS) {
      if (typeof raw[key] === "string" && raw[key]) utm[key] = (raw[key] as string).slice(0, 200);
    }
  } catch {
    // Ignore malformed attribution; it is optional.
  }
  return { source_page, utm };
}
