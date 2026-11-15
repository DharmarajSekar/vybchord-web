import type { ActionResult } from "@/lib/forms/types";

/** Result of an admin server action. Errors reuse the public form shape (message + field errors). */
export type AdminResult = { ok: true; message?: string; id?: string } | ActionResult;

export const notAuthorised: ActionResult = {
  ok: false,
  message: "Your session has expired. Sign in again to continue.",
};

/** Turns a database error into a message for the form. Unique slugs get a field error. */
export function dbError(error: { code?: string; message: string }, entity: string): ActionResult {
  if (error.code === "23505") {
    return {
      ok: false,
      message: "That slug is already used.",
      fieldErrors: { slug: "Already used. Choose another slug." },
    };
  }
  console.error(`[admin] ${entity} save failed`, error.message);
  return { ok: false, message: `Could not save the ${entity}. Please try again.` };
}

/** Empty strings from the form are stored as NULL. */
export function nullIfEmpty<T extends Record<string, unknown>>(values: T): T {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === "" ? null : value]),
  ) as T;
}
