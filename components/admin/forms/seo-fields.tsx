"use client";

import type { Control, FieldValues } from "react-hook-form";
import { TextareaField, TextField } from "@/components/forms/fields";

/** SEO title/description overrides shared by content editors. */
export function SeoFields<T extends FieldValues>({
  control,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- forms use distinct input/output types
  control: Control<T, any, any>;
}) {
  return (
    <fieldset className="space-y-6 rounded-xl p-5 ring-1 ring-foreground/10">
      <legend className="px-1 text-sm font-medium">Search engines</legend>
      <TextField
        control={control}
        name={"seo_title" as never}
        label="SEO title"
        description="Up to 70 characters. Leave empty to use the title."
        optional
      />
      <TextareaField
        control={control}
        name={"seo_description" as never}
        label="SEO description"
        description="Up to 160 characters. Shown in search results."
        optional
        rows={2}
      />
    </fieldset>
  );
}
