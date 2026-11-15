import "server-only";
import type { z } from "zod";
import { sendLeadEmails } from "@/lib/email/send";
import type { EmailField } from "@/lib/email/templates/lead-alert";
import { isDisposableEmail } from "./disposable";
import { guardSubmission } from "./guard";
import { formDataToObject, validationError } from "./parse";
import type { ActionResult, FormKey } from "./types";

export type Saved = {
  ok: true;
  title: string;
  visitor: { email: string; name?: string };
  fields: EmailField[];
  adminPath: string;
};

type Options<S extends z.ZodType> = {
  form: FormKey;
  formData: FormData;
  schema: S;
  /** Keys that carry multiple values (checkbox groups). */
  arrays?: string[];
  /** FRD §4 rule 1: F1–F3 reject disposable inboxes in this field. */
  workEmailField?: keyof z.output<S> & string;
  /** Steps 5–6: upload and insert. Runs only for genuine, verified, rate-limited submissions. */
  save: (values: z.output<S>, formData: FormData) => Promise<Saved | ActionResult>;
};

/**
 * Tech spec §4 pipeline, steps 1–7. Returns an error for the form, or null on success
 * (the calling action then redirects to /thank-you/<form>, step 8).
 */
export async function handleSubmission<S extends z.ZodType>({
  form,
  formData,
  schema,
  arrays,
  workEmailField,
  save,
}: Options<S>): Promise<ActionResult | null> {
  const parsed = schema.safeParse(formDataToObject(formData, arrays));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  if (workEmailField && isDisposableEmail(String(values[workEmailField]))) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: { [workEmailField]: "Please use your work email, not a temporary inbox" },
    };
  }

  const guard = await guardSubmission(formData, form);
  if (guard.kind === "reject") return guard.result;
  if (guard.kind === "spam") return null;

  const saved = await save(values, formData);
  if (!saved.ok) return saved;

  await sendLeadEmails({ form, ...saved });
  return null;
}

/** Builds the founder-alert field list, dropping empty values. */
export function emailFields(pairs: [string, string | number | undefined | null][]): EmailField[] {
  return pairs
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => ({ label, value: String(value) }));
}
