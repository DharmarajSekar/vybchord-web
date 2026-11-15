"use client";

import Image from "next/image";
import { ArrowLeftIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useId, useState } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import type { BaseFieldProps } from "@/components/forms/fields";
import { mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_MB = 5;

/**
 * Uploads images to the public `media` bucket (storage policy: admins only) and keeps their paths.
 * `max: 1` makes it a single-image field (cover image), stored as an array of one.
 */
export function ImageListField<T extends FieldValues>({
  control,
  name,
  label,
  folder,
  max,
}: BaseFieldProps<T> & { folder: string; max?: number }) {
  const id = useId();
  const [uploading, setUploading] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const paths = (field.value as string[] | undefined) ?? [];
        const full = max !== undefined && paths.length >= max;

        async function upload(files: FileList | null) {
          if (!files?.length) return;
          setUploading(true);
          const added: string[] = [];
          for (const file of Array.from(files).slice(0, max ? max - paths.length : undefined)) {
            const ext = TYPES[file.type];
            if (!ext || file.size > MAX_MB * 1024 * 1024) {
              toast.error(`${file.name}: use PNG, JPG or WebP up to ${MAX_MB} MB.`);
              continue;
            }
            const path = `${folder}/${crypto.randomUUID()}.${ext}`;
            const { error } = await createClient()
              .storage.from("media")
              .upload(path, file, { contentType: file.type });
            if (error) toast.error(`${file.name}: upload failed (${error.message}).`);
            else added.push(path);
          }
          field.onChange([...paths, ...added]);
          setUploading(false);
        }

        return (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{label}</legend>
            <FieldDescription>
              PNG, JPG or WebP, up to {MAX_MB} MB each. The first image is used as the preview.
            </FieldDescription>
            {paths.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {paths.map((path, index) => (
                  <li key={path} className="space-y-1">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10">
                      <Image
                        src={mediaUrl(path)}
                        alt={`Image ${index + 1}`}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-1">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Move image ${index + 1} earlier`}
                          onClick={() => {
                            const next = [...paths];
                            [next[index - 1], next[index]] = [next[index], next[index - 1]];
                            field.onChange(next);
                          }}
                        >
                          <ArrowLeftIcon aria-hidden />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove image ${index + 1}`}
                        onClick={() => field.onChange(paths.filter((p) => p !== path))}
                      >
                        <Trash2Icon aria-hidden />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!full && (
              <label
                htmlFor={id}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted"
              >
                <UploadIcon className="size-4" aria-hidden />
                {uploading ? "Uploading…" : "Upload images"}
                <input
                  id={id}
                  type="file"
                  accept={Object.keys(TYPES).join(",")}
                  multiple={max !== 1}
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    void upload(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </fieldset>
        );
      }}
    />
  );
}
