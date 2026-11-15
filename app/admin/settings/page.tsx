import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { requireAdmin } from "@/lib/admin/auth";
import { parseStringMap } from "@/lib/data/json";
import type { SettingsInput } from "@/lib/validations/admin/records";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Settings" };
}

/** FR-A8 site settings. */
export default async function SettingsPage() {
  const { supabase } = await requireAdmin("/admin/settings");
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const socials = parseStringMap(data?.socials ?? null);
  const s = (value: string | null | undefined) => value ?? "";

  const values: SettingsInput = {
    legal_name: data?.legal_name ?? "",
    cin: s(data?.cin),
    gstin: s(data?.gstin),
    registered_office: s(data?.registered_office),
    email: s(data?.email),
    phone: s(data?.phone),
    whatsapp: s(data?.whatsapp),
    socials: {
      linkedin: s(socials.linkedin),
      x: s(socials.x),
      github: s(socials.github),
      youtube: s(socials.youtube),
      instagram: s(socials.instagram),
      facebook: s(socials.facebook),
    },
    announcement: s(data?.announcement),
    grievance_officer_name: s(data?.grievance_officer_name),
    grievance_officer_email: s(data?.grievance_officer_email),
  };

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Company details used across the public website."
      />
      <SettingsForm values={values} />
    </>
  );
}
