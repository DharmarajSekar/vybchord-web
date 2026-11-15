"use client";

import Link from "next/link";
import { useId } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Option } from "@/lib/validations/options";
import { DOCUMENT_ACCEPT } from "@/lib/validations/shared";
import { describedBy, FieldHeading, type BaseFieldProps } from "./fields";

/** Multi-select as a checkbox group, e.g. F3 roles. */
export function CheckboxGroupField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
}: BaseFieldProps<T> & { options: readonly Option[] }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected: string[] = field.value ?? [];
        const toggle = (value: string, checked: boolean) =>
          field.onChange(checked ? [...selected, value] : selected.filter((v) => v !== value));
        return (
          <FieldSet
            data-invalid={fieldState.invalid}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
          >
            <FieldLegend variant="label">{label}</FieldLegend>
            {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option, index) => (
                <Field key={option.value} orientation="horizontal">
                  <Checkbox
                    id={`${id}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) => toggle(option.value, checked === true)}
                    onBlur={field.onBlur}
                    inputRef={index === 0 ? field.ref : undefined}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor={`${id}-${option.value}`} className="font-normal">
                    {option.label}
                  </FieldLabel>
                </Field>
              ))}
            </div>
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          </FieldSet>
        );
      }}
    />
  );
}

/** PDF/Word upload. The value is the FileList; the zod schema takes the first file. */
export function FileField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
}: BaseFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, name: fieldName, onBlur, onChange }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldHeading id={id} label={label} optional={optional} />
          <Input
            ref={ref}
            name={fieldName}
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.files)}
            id={id}
            type="file"
            accept={DOCUMENT_ACCEPT}
            aria-invalid={fieldState.invalid}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
            className="h-10 cursor-pointer py-1.5"
          />
          {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

/** NFR-6 / FRD §4 rule 5: purpose-specific consent with a Privacy Policy link. */
export function ConsentField<T extends FieldValues>({
  control,
  name,
  purpose,
}: Omit<BaseFieldProps<T>, "label"> & { purpose: string }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="horizontal" className="items-start">
          <Checkbox
            id={id}
            checked={field.value === true}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            inputRef={field.ref}
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.invalid ? `${id}-error` : undefined}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <FieldLabel htmlFor={id} className="leading-snug font-normal">
              <span>
                I agree that Vybchord may use these details to {purpose}. See our{" "}
                <Link
                  href="/legal/privacy"
                  className="underline underline-offset-4"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </FieldLabel>
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          </div>
        </Field>
      )}
    />
  );
}
