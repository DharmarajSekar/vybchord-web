"use client";

import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { ConsentField } from "./choice-fields";
import { TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

/** F6 Newsletter (double opt-in). Placed on /insights. */
export function NewsletterForm() {
  const form = useLeadForm(newsletterSchema, { email: "", consent: false });
  const { control } = form;

  return (
    <FormShell
      form={form}
      action={subscribeNewsletter}
      label="Newsletter sign-up"
      submitLabel="Subscribe"
    >
      <TextField
        control={control}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
      />
      <ConsentField
        control={control}
        name="consent"
        purpose="email me new insights articles. I can unsubscribe at any time"
      />
    </FormShell>
  );
}
