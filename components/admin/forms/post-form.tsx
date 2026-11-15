"use client";

import { TextareaField, TextField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { DateTimeField, StringListField } from "@/components/admin/form/fields";
import { ImageListField } from "@/components/admin/form/image-list-field";
import { savePost } from "@/lib/admin/actions/content";
import { postSchema, type PostInput } from "@/lib/validations/admin/content";
import { SeoFields } from "./seo-fields";

export const emptyPost: PostInput = {
  title: "",
  slug: "",
  excerpt: "",
  body_mdx: "",
  cover_image: [],
  category: "",
  tags: [],
  author: "",
  published_at: "",
  seo_title: "",
  seo_description: "",
};

/** FR-A5 insights editor: Markdown body, category, tags, cover, scheduled publishing, SEO. */
export function PostForm({ id, values }: { id: string | null; values: PostInput }) {
  const form = useLeadForm(postSchema, values);
  const { control } = form;

  return (
    <AdminForm
      form={form}
      action={(v) => savePost(id, v)}
      afterCreate={(newId) => `/admin/insights/${newId}`}
    >
      <DateTimeField
        control={control}
        name="published_at"
        label="Publish date"
        description="Leave empty to keep as a draft. A future date schedules the post; it appears within an hour of that time."
        optional
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="title" label="Title" />
        <TextField
          control={control}
          name="slug"
          label="Slug"
          description="Used in the URL: /insights/slug"
        />
        <TextField control={control} name="category" label="Category" optional />
        <TextField control={control} name="author" label="Author" optional />
      </div>
      <TextareaField
        control={control}
        name="excerpt"
        label="Excerpt"
        description="One or two sentences for cards and search results."
        optional
        rows={2}
      />
      <ImageListField
        control={control}
        name="cover_image"
        label="Cover image"
        folder="posts"
        max={1}
      />
      <TextareaField
        control={control}
        name="body_mdx"
        label="Article"
        description="Markdown: ## headings, **bold**, [links](https://…), lists, tables and images. HTML tags and {code} are removed when published."
        rows={20}
      />
      <StringListField
        control={control}
        name="tags"
        label="Tags"
        description="One per line. Shared tags link related articles."
      />
      <SeoFields control={control} />
    </AdminForm>
  );
}
