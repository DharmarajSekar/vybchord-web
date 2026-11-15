"use client";

import { TextareaField, TextField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { saveSettings } from "@/lib/admin/actions/records";
import { settingsSchema, type SettingsInput } from "@/lib/validations/admin/records";

const socials = [
  ["linkedin", "LinkedIn"],
  ["x", "X"],
  ["github", "GitHub"],
  ["youtube", "YouTube"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
] as const;

function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-6 rounded-xl p-5 ring-1 ring-foreground/10">
      <legend className="px-1 font-medium">{title}</legend>
      {description && <p className="-mt-2 text-sm text-muted-foreground">{description}</p>}
      {children}
    </fieldset>
  );
}

/** FR-A8 settings. Saving refreshes the whole public site (footer, About, legal pages, JSON-LD). */
export function SettingsForm({ values }: { values: SettingsInput }) {
  const form = useLeadForm(settingsSchema, values);
  const { control } = form;

  return (
    <AdminForm form={form} action={saveSettings}>
      <Group
        title="Company"
        description="Shown in the footer, About page, legal pages and search engine data."
      >
        <TextField control={control} name="legal_name" label="Legal name" />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={control} name="cin" label="CIN" optional />
          <TextField
            control={control}
            name="gstin"
            label="GSTIN"
            description="Shown once issued."
            optional
          />
        </div>
        <TextareaField
          control={control}
          name="registered_office"
          label="Registered office"
          optional
          rows={3}
        />
      </Group>
      <Group title="Contact">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={control} name="email" label="Email" type="email" optional />
          <TextField control={control} name="phone" label="Phone" type="tel" optional />
          <TextField
            control={control}
            name="whatsapp"
            label="WhatsApp number"
            description="With country code, e.g. 91 98765 43210."
            optional
          />
        </div>
      </Group>
      <Group title="Social links" description="Full https:// links. Empty ones are hidden.">
        <div className="grid gap-6 sm:grid-cols-2">
          {socials.map(([key, label]) => (
            <TextField
              key={key}
              control={control}
              name={`socials.${key}`}
              label={label}
              type="url"
              optional
            />
          ))}
        </div>
      </Group>
      <Group
        title="Announcement bar"
        description="Optional message shown above the header on every page."
      >
        <TextField control={control} name="announcement" label="Announcement" optional />
      </Group>
      <Group
        title="Grievance Officer"
        description="Required by the DPDP Act 2023; shown in the Privacy Policy and Grievance Officer page."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={control} name="grievance_officer_name" label="Name" optional />
          <TextField
            control={control}
            name="grievance_officer_email"
            label="Email"
            type="email"
            optional
          />
        </div>
      </Group>
    </AdminForm>
  );
}
