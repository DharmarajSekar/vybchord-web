"use client";

import { submitContact } from "@/lib/actions/contact";
import { contactSchema } from "@/lib/validations/contact";
import { ConsentField } from "./choice-fields";
import { TextareaField, TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

type Topic = "careers" | "other";

/** F5 General contact. The topic comes from the contact page's topic selector. */
export function ContactForm({ topic }: { topic: Topic }) {
  const form = useLeadForm(contactSchema, {
    name: "",
    email: "",
    topic,
    message: "",
    consent: false,
  });
  const { control } = form;

  return (
    <FormShell form={form} action={submitContact} label="Contact form" submitLabel="Send message">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="name" label="Full name" autoComplete="name" />
        <TextField
          control={control}
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <TextField
          control={control}
          name="company"
          label="Company"
          autoComplete="organization"
          optional
        />
        <TextField
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
        />
      </div>
      <TextareaField control={control} name="message" label="Message" rows={6} />
      <ConsentField control={control} name="consent" purpose="reply to this message" />
    </FormShell>
  );
}
