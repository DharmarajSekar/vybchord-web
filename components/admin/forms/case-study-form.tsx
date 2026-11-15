"use client";

import { SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { StringListField, SwitchField } from "@/components/admin/form/fields";
import { ImageListField } from "@/components/admin/form/image-list-field";
import { saveCaseStudy } from "@/lib/admin/actions/content";
import { toOptions } from "@/lib/admin/labels";
import { businessLineLabel } from "@/lib/site/labels";
import { caseStudySchema, type CaseStudyInput } from "@/lib/validations/admin/content";
import { SeoFields } from "./seo-fields";

export const emptyCaseStudy: CaseStudyInput = {
  title: "",
  slug: "",
  client_name: "",
  anonymised: false,
  industry: "",
  line: "services",
  challenge: "",
  solution: "",
  outcome: "",
  stack: [],
  images: [],
  seo_title: "",
  seo_description: "",
  published: false,
};

/** FR-A4 case study editor. Only publish client work with approval, or mark it anonymised (BRD §7). */
export function CaseStudyForm({ id, values }: { id: string | null; values: CaseStudyInput }) {
  const form = useLeadForm(caseStudySchema, values);
  const { control } = form;

  return (
    <AdminForm
      form={form}
      action={(v) => saveCaseStudy(id, v)}
      afterCreate={(newId) => `/admin/case-studies/${newId}`}
    >
      <SwitchField
        control={control}
        name="published"
        label="Published"
        description="Show this case study on the website."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="title" label="Title" />
        <TextField
          control={control}
          name="slug"
          label="Slug"
          description="Used in the URL: /case-studies/slug"
        />
        <SelectField
          control={control}
          name="line"
          label="Business line"
          options={toOptions(businessLineLabel)}
        />
        <TextField control={control} name="industry" label="Industry" optional />
        <TextField control={control} name="client_name" label="Client name" optional />
      </div>
      <SwitchField
        control={control}
        name="anonymised"
        label="Anonymised"
        description="Hide the client's name and show “Confidential client”."
      />
      <TextareaField control={control} name="challenge" label="The challenge" optional rows={4} />
      <TextareaField control={control} name="solution" label="What we built" optional rows={4} />
      <TextareaField control={control} name="outcome" label="The outcome" optional rows={3} />
      <StringListField
        control={control}
        name="stack"
        label="Stack"
        description="One technology per line."
      />
      <ImageListField control={control} name="images" label="Screenshots" folder="case-studies" />
      <SeoFields control={control} />
    </AdminForm>
  );
}
