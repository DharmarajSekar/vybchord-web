"use client";

import { submitStaffing } from "@/lib/actions/staffing";
import { engagementModels, roleOptions, workModeOptions } from "@/lib/validations/options";
import { staffingSchema } from "@/lib/validations/staffing";
import { CheckboxGroupField, ConsentField } from "./choice-fields";
import { SelectField, TextareaField, TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

/** F3 Staff augmentation request. */
export function StaffingForm({ defaultRole }: { defaultRole?: string }) {
  const form = useLeadForm(staffingSchema, {
    name: "",
    work_email: "",
    company: "",
    roles: roleOptions.some((r) => r.value === defaultRole) ? [defaultRole as string] : [],
    headcount: 1,
    start_date: "",
    consent: false,
  });
  const { control } = form;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <FormShell
      form={form}
      action={submitStaffing}
      label="Engineer request"
      submitLabel="Request engineers"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField control={control} name="name" label="Full name" autoComplete="name" />
        <TextField
          control={control}
          name="work_email"
          label="Work email"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <TextField control={control} name="company" label="Company" autoComplete="organization" />
      </div>
      <CheckboxGroupField
        control={control}
        name="roles"
        label="Roles needed"
        options={roleOptions}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          control={control}
          name="headcount"
          label="Number of engineers"
          type="number"
          inputMode="numeric"
          min={1}
        />
        <TextField control={control} name="start_date" label="Start date" type="date" min={today} />
        <TextField
          control={control}
          name="duration_months"
          label="Duration (months)"
          type="number"
          inputMode="numeric"
          min={1}
          optional
        />
        <SelectField
          control={control}
          name="engagement_model"
          label="Engagement model"
          options={engagementModels}
          optional
        />
        <SelectField
          control={control}
          name="work_mode"
          label="Work mode"
          options={workModeOptions}
          optional
        />
        <TextField control={control} name="location" label="Location" optional />
        <TextField
          control={control}
          name="budget_per_resource"
          label="Budget per engineer"
          placeholder="e.g. ₹1.5 lakh per month"
          optional
        />
      </div>
      <TextareaField
        control={control}
        name="skills"
        label="Skills and experience"
        description="Technologies, seniority and anything else that matters."
        optional
        rows={4}
      />
      <ConsentField
        control={control}
        name="consent"
        purpose="respond to this request and share matching engineer profiles"
      />
    </FormShell>
  );
}
