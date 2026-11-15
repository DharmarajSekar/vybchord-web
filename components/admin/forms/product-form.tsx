"use client";

import { SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { RepeaterField, StringListField, SwitchField } from "@/components/admin/form/fields";
import { ImageListField } from "@/components/admin/form/image-list-field";
import { saveProduct } from "@/lib/admin/actions/content";
import { productStatusLabel, toOptions } from "@/lib/admin/labels";
import { productSchema, type ProductInput } from "@/lib/validations/admin/content";
import { SeoFields } from "./seo-fields";

export const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  tagline: "",
  summary: "",
  problem: "",
  domain: "",
  status: "coming_soon",
  modules: [],
  screenshots: [],
  deployment_options: [],
  security_notes: [],
  faqs: [],
  seo_title: "",
  seo_description: "",
  sort_order: 0,
  published: false,
};

/** FR-A3 product editor. */
export function ProductForm({ id, values }: { id: string | null; values: ProductInput }) {
  const form = useLeadForm(productSchema, values);
  const { control } = form;

  return (
    <AdminForm
      form={form}
      action={(v) => saveProduct(id, v)}
      afterCreate={(newId) => `/admin/products/${newId}`}
    >
      <SwitchField
        control={control}
        name="published"
        label="Published"
        description="Show this product on the website."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="name" label="Name" />
        <TextField
          control={control}
          name="slug"
          label="Slug"
          description="Used in the URL: /products/slug"
        />
        <SelectField
          control={control}
          name="status"
          label="Status"
          options={toOptions(productStatusLabel)}
        />
        <TextField
          control={control}
          name="domain"
          label="Domain"
          placeholder="e.g. HRTech"
          optional
        />
        <TextField
          control={control}
          name="sort_order"
          label="Display order"
          type="number"
          inputMode="numeric"
          description="Lower numbers show first."
        />
      </div>
      <TextField control={control} name="tagline" label="Tagline" optional />
      <TextareaField control={control} name="summary" label="Summary" optional rows={3} />
      <TextareaField control={control} name="problem" label="Problem it solves" optional rows={4} />
      <RepeaterField
        control={control}
        name="modules"
        label="Modules"
        keys={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description" },
        ]}
        addLabel="Add module"
      />
      <ImageListField control={control} name="screenshots" label="Screenshots" folder="products" />
      <StringListField
        control={control}
        name="deployment_options"
        label="Deployment options"
        description="One per line, e.g. SaaS, On-premise, White-label."
      />
      <StringListField
        control={control}
        name="security_notes"
        label="Security notes"
        description="One per line."
      />
      <RepeaterField
        control={control}
        name="faqs"
        label="FAQs"
        keys={[
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer" },
        ]}
        addLabel="Add FAQ"
      />
      <SeoFields control={control} />
    </AdminForm>
  );
}
