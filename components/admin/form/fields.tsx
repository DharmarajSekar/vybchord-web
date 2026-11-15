"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { describedBy, FieldHeading, type BaseFieldProps } from "@/components/forms/fields";

/** On/off setting, e.g. "Published". */
export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: BaseFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" className="items-center">
          <Switch
            id={id}
            checked={field.value === true}
            onCheckedChange={(v) => field.onChange(v === true)}
          />
          <div>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </div>
        </Field>
      )}
    />
  );
}

/** string[] edited as one item per line (stack, tags, skills, security notes…). */
export function StringListField<T extends FieldValues>({
  control,
  name,
  label,
  description = "One per line.",
  optional = true,
  rows = 4,
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
            id={id}
            rows={rows}
            value={((field.value as string[] | undefined) ?? []).join("\n")}
            onChange={(e) => field.onChange(e.target.value.split("\n"))}
            onBlur={() => {
              field.onChange(
                ((field.value as string[]) ?? []).map((s) => s.trim()).filter(Boolean),
              );
              field.onBlur();
            }}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
          />
          <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

type Pair = Record<string, string>;

/** Repeating pairs such as product modules {title, description} or FAQs {question, answer}. */
export function RepeaterField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  keys,
  addLabel,
}: BaseFieldProps<T> & {
  keys: [{ key: string; label: string }, { key: string; label: string }];
  addLabel: string;
}) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const items = (field.value as Pair[] | undefined) ?? [];
        const update = (index: number, key: string, value: string) =>
          field.onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
        return (
          <fieldset className="space-y-3" aria-describedby={description ? `${id}-desc` : undefined}>
            <legend className="text-sm font-medium">{label}</legend>
            {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
            {items.map((item, index) => (
              <div key={index} className="space-y-2 rounded-lg p-3 ring-1 ring-foreground/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove item ${index + 1}`}
                    onClick={() => field.onChange(items.filter((_, i) => i !== index))}
                  >
                    <Trash2Icon aria-hidden />
                  </Button>
                </div>
                <Input
                  aria-label={`${keys[0].label} ${index + 1}`}
                  placeholder={keys[0].label}
                  value={item[keys[0].key] ?? ""}
                  onChange={(e) => update(index, keys[0].key, e.target.value)}
                />
                <Textarea
                  aria-label={`${keys[1].label} ${index + 1}`}
                  placeholder={keys[1].label}
                  rows={2}
                  value={item[keys[1].key] ?? ""}
                  onChange={(e) => update(index, keys[1].key, e.target.value)}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => field.onChange([...items, { [keys[0].key]: "", [keys[1].key]: "" }])}
            >
              <PlusIcon aria-hidden />
              {addLabel}
            </Button>
            {fieldState.error && (
              <p role="alert" className="text-sm text-destructive">
                {fieldState.error.message ??
                  `Every item needs a ${keys[0].label.toLowerCase()} and ${keys[1].label.toLowerCase()}.`}
              </p>
            )}
          </fieldset>
        );
      }}
    />
  );
}

/** ISO timestamp edited as a local date-time (scheduled posts, job closing dates). */
export function DateTimeField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
}: BaseFieldProps<T>) {
  const id = useId();
  const toLocal = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldHeading id={id} label={label} optional={optional} />
          <Input
            id={id}
            type="datetime-local"
            className="h-10"
            value={toLocal(field.value as string | null)}
            onChange={(e) =>
              field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")
            }
            onBlur={field.onBlur}
            aria-describedby={describedBy(id, description, fieldState.invalid)}
          />
          {description && <FieldDescription id={`${id}-desc`}>{description}</FieldDescription>}
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
