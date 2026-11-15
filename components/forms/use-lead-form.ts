"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { z } from "zod";

/** React Hook Form with the form's shared zod schema (CLAUDE.md rule 4). */
export function useLeadForm<Input extends FieldValues, Output extends FieldValues>(
  schema: z.ZodType<Output, Input>,
  defaultValues: DefaultValues<Input>,
) {
  return useForm<Input, unknown, Output>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
