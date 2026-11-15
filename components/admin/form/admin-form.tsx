"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AdminResult } from "@/lib/admin/result";

type AdminFormProps<Input extends FieldValues, Output extends FieldValues> = {
  form: UseFormReturn<Input, unknown, Output>;
  /** Server action; receives values already validated by the shared zod schema. */
  action: (values: Output) => Promise<AdminResult>;
  submitLabel?: string;
  /** Where to go after a successful create, given the new row's id. */
  afterCreate?: (id: string) => string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Admin edit form: client zod validation, server action, field errors, toast and refresh. */
export function AdminForm<Input extends FieldValues, Output extends FieldValues>({
  form,
  action,
  submitLabel = "Save",
  afterCreate,
  children,
  footer,
}: AdminFormProps<Input, Output>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (values: Output) => {
    setError(null);
    startTransition(async () => {
      const result = await action(values);
      if (!result.ok) {
        for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
          form.setError(name as Path<Input>, { type: "server", message }, { shouldFocus: true });
        }
        setError(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(result.message ?? "Saved");
      form.reset(form.getValues());
      if (afterCreate && result.id) router.push(afterCreate(result.id));
      else router.refresh();
    });
  };

  return (
    <form
      onSubmit={(event) => form.handleSubmit(submit)(event)}
      noValidate
      className="max-w-3xl space-y-6"
    >
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t pt-6">
        <Button type="submit" size="lg" disabled={pending} className="h-10 px-5">
          {pending ? "Saving…" : submitLabel}
        </Button>
        {footer}
      </div>
    </form>
  );
}
