"use client";

import { useId, type HTMLInputTypeAttribute } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Option } from "@/lib/validations/options";

export type BaseFieldProps<T extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- forms use distinct input/output types
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  optional?: boolean;
};

export function FieldHeading({
  id,
  label,
  optional,
}: {
  id: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <FieldLabel htmlFor={id}>
      {label}
      {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
    </FieldLabel>
  );
}

/** ids for aria-describedby: description and error. */
export function describedBy(id: string, description?: string, invalid?: boolean) {
  return (
    [description && `${id}-desc`, invalid && `${id}-error`].filter(Boolean).join(" ") || undefined
  );
}

type TextFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "url";
  placeholder?: string;
  min?: string | number;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  ...inputProps
}: TextFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldHeading id={id} label={label} optional={optional} />
          <Input
            {...inputProps}
            {...field}
            value={field.value ?? ""}
            id={id}
            aria-invalid={fieldState.invalid}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
            aria-required={!optional}
            className="h-10"
          />
          {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  rows = 5,
}: BaseFieldProps<T> & { rows?: number }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldHeading id={id} label={label} optional={optional} />
          <Textarea
            {...field}
            value={field.value ?? ""}
            id={id}
            rows={rows}
            // shadcn Textarea sizes to content and ignores rows; keep rows as the minimum height.
            style={{ minHeight: `${rows * 1.5 + 1}rem` }}
            aria-invalid={fieldState.invalid}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
            aria-required={!optional}
          />
          {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  options,
  placeholder = "Choose…",
}: BaseFieldProps<T> & { options: readonly Option[]; placeholder?: string }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldHeading id={id} label={label} optional={optional} />
          <Select
            items={options}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? "")}
            onOpenChange={(open) => !open && field.onBlur()}
          >
            <SelectTrigger
              id={id}
              ref={field.ref}
              className="h-10 w-full data-[size=default]:h-10"
              aria-invalid={fieldState.invalid}
              aria-describedby={describedBy(id, description, fieldState.invalid)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
