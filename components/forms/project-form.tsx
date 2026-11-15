"use client";

import { submitProject } from "@/lib/actions/project";
import { budgetRanges, projectTypes, timelines } from "@/lib/validations/options";
import { PROJECT_ATTACHMENT_MAX_MB, projectSchema } from "@/lib/validations/project";
import { ConsentField, FileField } from "./choice-fields";
import { SelectField, TextareaField, TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

/** F2 Project enquiry. */
export function ProjectForm({ defaultService }: { defaultService?: string }) {
  const form = useLeadForm(projectSchema, {
    name: "",
    work_email: "",
    company: "",
    project_type: projectTypes.some((t) => t.value === defaultService) ? defaultService : "",
    description: "",
    consent: false,
  });
  const { control } = form;

  return (
    <FormShell
      form={form}
      action={submitProject}
      label="Project enquiry"
      submitLabel="Send project brief"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="name" label="Full name" autoComplete="name" />
        <TextField
          control={control}
          name="work_email"
          label="Work email"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <TextField control={control} name="company" label="Company" autoComplete="organization" />
        <TextField
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
        />
        <SelectField
          control={control}
          name="project_type"
          label="Project type"
          options={projectTypes}
        />
        <SelectField
          control={control}
          name="budget_range"
          label="Budget"
          options={budgetRanges}
          optional
        />
        <SelectField
          control={control}
          name="timeline"
          label="Timeline"
          options={timelines}
          optional
        />
      </div>
      <TextareaField
        control={control}
        name="description"
        label="Describe your project"
        description="Goals, users, key features and any deadlines."
        rows={6}
      />
      <FileField
        control={control}
        name="attachment"
        label="Brief or spec"
        description={`PDF or Word, up to ${PROJECT_ATTACHMENT_MAX_MB} MB.`}
        optional
      />
      <ConsentField
        control={control}
        name="consent"
        purpose="respond to this project enquiry and prepare an estimate"
      />
    </FormShell>
  );
}
