"use client";

import { submitDemo } from "@/lib/actions/demo";
import { demoSchema } from "@/lib/validations/demo";
import { companySizes, interestTypes, timelines, type Option } from "@/lib/validations/options";
import { ConsentField } from "./choice-fields";
import { SelectField, TextareaField, TextField } from "./fields";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

type DemoFormProps = {
  products: Option[];
  defaultProduct?: string;
  defaultInterest?: string;
};

/** F1 Product demo / licensing. */
export function DemoForm({ products, defaultProduct, defaultInterest }: DemoFormProps) {
  const form = useLeadForm(demoSchema, {
    name: "",
    work_email: "",
    company: "",
    product: products.some((p) => p.value === defaultProduct) ? defaultProduct : "",
    interest_type: interestTypes.some((i) => i.value === defaultInterest)
      ? (defaultInterest as (typeof interestTypes)[number]["value"])
      : "demo",
    consent: false,
  });
  const { control } = form;

  return (
    <FormShell
      form={form}
      action={submitDemo}
      label="Product demo request"
      submitLabel="Request a demo"
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
        <TextField
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
        />
        <SelectField control={control} name="product" label="Product" options={products} />
        <SelectField
          control={control}
          name="interest_type"
          label="I'm interested in"
          options={interestTypes}
        />
        <SelectField
          control={control}
          name="company_size"
          label="Company size"
          options={companySizes}
          optional
        />
        <SelectField
          control={control}
          name="timeline"
          label="Timeline"
          options={timelines}
          optional
        />
      </div>
      <TextareaField
        control={control}
        name="message"
        label="What should the demo cover?"
        optional
        rows={4}
      />
      <ConsentField
        control={control}
        name="consent"
        purpose="contact me about this demo or licensing request"
      />
    </FormShell>
  );
}
