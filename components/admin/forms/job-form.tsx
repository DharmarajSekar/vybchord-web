"use client";

import { SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { DateTimeField, StringListField, SwitchField } from "@/components/admin/form/fields";
import { saveJob } from "@/lib/admin/actions/content";
import { toOptions } from "@/lib/admin/labels";
import { jobTypeLabel } from "@/lib/site/labels";
import { jobSchema, type JobInput } from "@/lib/validations/admin/content";

export const emptyJob: JobInput = {
  title: "",
  slug: "",
  type: "full_time",
  location: "",
  work_mode: "",
  experience: "",
  description_mdx: "",
  skills: [],
  is_open: true,
  valid_through: "",
};

const workModes = ["Remote", "Onsite", "Hybrid"].map((mode) => ({ value: mode, label: mode }));

/** FR-A6 job editor. Untick "Open" to close the role; it leaves the site and Google Jobs. */
export function JobForm({ id, values }: { id: string | null; values: JobInput }) {
  const form = useLeadForm(jobSchema, values);
  const { control } = form;

  return (
    <AdminForm
      form={form}
      action={(v) => saveJob(id, v)}
      afterCreate={(newId) => `/admin/jobs/${newId}`}
    >
      <SwitchField
        control={control}
        name="is_open"
        label="Open"
        description="Accepting applications and listed on the careers page."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="title" label="Title" />
        <TextField
          control={control}
          name="slug"
          label="Slug"
          description="Used in the URL: /careers/slug"
        />
        <SelectField control={control} name="type" label="Type" options={toOptions(jobTypeLabel)} />
        <SelectField
          control={control}
          name="work_mode"
          label="Work mode"
          options={workModes}
          optional
        />
        <TextField
          control={control}
          name="location"
          label="Location"
          placeholder="e.g. Chennai"
          optional
        />
        <TextField
          control={control}
          name="experience"
          label="Experience"
          placeholder="e.g. 3–6 years"
          optional
        />
      </div>
      <DateTimeField
        control={control}
        name="valid_through"
        label="Close applications on"
        description="Optional. The role is hidden after this date."
        optional
      />
      <TextareaField
        control={control}
        name="description_mdx"
        label="Description"
        description="Markdown: ## headings, **bold**, lists and links."
        rows={16}
      />
      <StringListField
        control={control}
        name="skills"
        label="Skills"
        description="One per line. Used for search and Google Jobs."
      />
    </AdminForm>
  );
}
