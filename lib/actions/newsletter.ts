"use server";

import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { sendNewsletterConfirmation } from "@/lib/email/send";
import { guardSubmission } from "@/lib/forms/guard";
import { insertLead, saveFailed } from "@/lib/forms/leads";
import { formDataToObject, validationError } from "@/lib/forms/parse";
import type { ActionResult } from "@/lib/forms/types";
import { absoluteUrl } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validations/newsletter";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** F6 Newsletter, step 1 of double opt-in: store unconfirmed and email a confirmation link. */
export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return validationError(parsed.error);

  const guard = await guardSubmission(formData, "newsletter");
  if (guard.kind === "reject") return guard.result;

  if (guard.kind === "pass") {
    const { email } = parsed.data;
    const { data: existing } = await createAdminClient()
      .from("leads")
      .select("id")
      .eq("form_type", "newsletter")
      .eq("email", email)
      .eq("payload->>confirmed", "true")
      .limit(1);

    // Already subscribed: show the same page, so the form never reveals who is subscribed.
    if (!existing?.length) {
      const token = randomBytes(32).toString("base64url");
      const id = await insertLead(
        {
          form_type: "newsletter",
          email,
          payload: { confirmed: false, token_hash: hashToken(token) },
        },
        formData,
      );
      if (!id) return saveFailed;
      await sendNewsletterConfirmation(email, absoluteUrl(`/newsletter/confirm?token=${token}`));
    }
  }
  redirect("/thank-you/newsletter");
}

/**
 * F6 step 2: confirms from a button on /newsletter/confirm (a POST), so email link scanners
 * that open the link cannot confirm on the visitor's behalf.
 */
export async function confirmNewsletter(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (token.length < 20) redirect("/newsletter/confirm?status=invalid");

  const supabase = createAdminClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("id, payload")
    .eq("form_type", "newsletter")
    .eq("payload->>token_hash", hashToken(token))
    .maybeSingle();
  if (!lead) redirect("/newsletter/confirm?status=invalid");

  const payload = (lead.payload ?? {}) as Record<string, unknown>;
  const { error } = await supabase
    .from("leads")
    .update({
      payload: {
        ...payload,
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        token_hash: null,
      },
    })
    .eq("id", lead.id);
  if (error) {
    console.error("[newsletter] confirm failed", error.message);
    redirect("/newsletter/confirm?status=error");
  }
  redirect("/thank-you/newsletter-confirmed");
}
