"use client";

import { submitApplication } from "@/lib/actions/application";
import { applicationSchema, CV_MAX_MB } from "@/lib/validations/application";
import { ConsentField, FileField } from "./choice-fields";
import { TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

/** F4 Job application. Placed on /careers/[slug]. */
export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const form = useLeadForm(applicationSchema, {
    name: "",
    email: "",
    phone: "",
    job_id: jobId,
    experience_years: "",
    consent: false,
  });
  const { control } = form;

  return (
    <FormShell
      form={form}
      action={submitApplication}
      label={`Apply for ${jobTitle}`}
      submitLabel="Submit application"
    >
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
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <TextField
          control={control}
          name="experience_years"
          label="Years of experience"
          type="number"
          inputMode="numeric"
          min={0}
        />
      </div>
      <FileField
        control={control}
        name="cv"
        label="CV"
        description={`PDF or Word, up to ${CV_MAX_MB} MB.`}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          control={control}
          name="linkedin"
          label="LinkedIn"
          type="url"
          inputMode="url"
          optional
        />
        <TextField
          control={control}
          name="github"
          label="GitHub"
          type="url"
          inputMode="url"
          optional
        />
        <TextField
          control={control}
          name="portfolio"
          label="Portfolio"
          type="url"
          inputMode="url"
          optional
        />
        <TextField control={control} name="notice_period" label="Notice period" optional />
        <TextField control={control} name="location" label="Current location" optional />
        <TextField control={control} name="expected_ctc" label="Expected CTC" optional />
      </div>
      <ConsentField
        control={control}
        name="consent"
        purpose="assess my application for this and similar roles, and keep my CV for up to 12 months"
      />
    </FormShell>
  );
}
