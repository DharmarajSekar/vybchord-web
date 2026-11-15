import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Enums, Json } from "@/lib/supabase/types";
import { readAttribution } from "./parse";
import type { ActionResult } from "./types";

type LeadInsert = {
  form_type: Enums<"lead_form_type">;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  payload: Record<string, Json | undefined>;
  attachment_path?: string;
};

export const saveFailed: ActionResult = {
  ok: false,
  message: "We could not save your request. Please try again, or email us directly.",
};

/** Tech spec §4 step 6: insert with the service-role client; RLS blocks the browser entirely. */
export async function insertLead(lead: LeadInsert, formData: FormData): Promise<string | null> {
  const { source_page, utm } = readAttribution(formData);
  const { data, error } = await createAdminClient()
    .from("leads")
    .insert({
      ...lead,
      name: lead.name ?? null,
      phone: lead.phone ?? null,
      company: lead.company ?? null,
      attachment_path: lead.attachment_path ?? null,
      source_page,
      utm,
      consent_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[leads] insert failed", lead.form_type, error.message);
    return null;
  }
  return data.id;
}
