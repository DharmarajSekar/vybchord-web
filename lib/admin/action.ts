import "server-only";
import type { z } from "zod";
import { validationError } from "@/lib/forms/parse";
import { getAdmin, type Admin } from "./auth";
import { notAuthorised, type AdminResult } from "./result";

/**
 * Wraps every admin mutation: confirms the admin session, then re-validates the input with the
 * form's shared zod schema (the browser's validation is never trusted), then runs `run`.
 */
export async function adminAction<S extends z.ZodType>(
  schema: S,
  input: unknown,
  run: (admin: Admin, values: z.output<S>) => Promise<AdminResult>,
): Promise<AdminResult> {
  const admin = await getAdmin();
  if (!admin) return notAuthorised;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  return run(admin, parsed.data);
}
