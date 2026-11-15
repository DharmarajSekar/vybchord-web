"use server";

import { adminAction } from "@/lib/admin/action";
import { logAdminAction } from "@/lib/admin/audit";
import { dbError, nullIfEmpty, type AdminResult } from "@/lib/admin/result";
import { revalidateSite } from "@/lib/admin/revalidate";
import {
  applicationSkillsSchema,
  applicationStatusSchema,
  leadNoteSchema,
  leadStatusSchema,
  settingsSchema,
} from "@/lib/validations/admin/records";

/** FR-A2 change a lead's status. */
export async function updateLeadStatus(input: unknown): Promise<AdminResult> {
  return adminAction(leadStatusSchema, input, async ({ supabase, user }, { id, status }) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return dbError(error, "lead");
    await logAdminAction({
      actor: user.id,
      action: "lead.status",
      entity: "lead",
      entityId: id,
      meta: { status },
    });
    return { ok: true, message: "Status updated" };
  });
}

/** FR-A2 add an internal note to a lead. */
export async function addLeadNote(input: unknown): Promise<AdminResult> {
  return adminAction(leadNoteSchema, input, async ({ supabase, user }, { lead_id, note }) => {
    const { error } = await supabase
      .from("lead_notes")
      .insert({ lead_id, note, created_by: user.id });
    if (error) return dbError(error, "note");
    await logAdminAction({
      actor: user.id,
      action: "lead.note",
      entity: "lead",
      entityId: lead_id,
    });
    return { ok: true, message: "Note added" };
  });
}

/** FR-A6 move an application through new → screening → interview → offer | rejected | bench. */
export async function updateApplicationStatus(input: unknown): Promise<AdminResult> {
  return adminAction(applicationStatusSchema, input, async ({ supabase, user }, { id, status }) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) return dbError(error, "application");
    await logAdminAction({
      actor: user.id,
      action: "application.status",
      entity: "application",
      entityId: id,
      meta: { status },
    });
    return { ok: true, message: "Status updated" };
  });
}

/** FR-A7 tag a bench candidate's skills for filtering. */
export async function updateApplicationSkills(input: unknown): Promise<AdminResult> {
  return adminAction(applicationSkillsSchema, input, async ({ supabase, user }, { id, skills }) => {
    const { error } = await supabase.from("applications").update({ skills }).eq("id", id);
    if (error) return dbError(error, "application");
    await logAdminAction({
      actor: user.id,
      action: "application.skills",
      entity: "application",
      entityId: id,
    });
    return { ok: true, message: "Skills saved" };
  });
}

/** FR-A8 company details, socials, announcement bar and Grievance Officer. */
export async function saveSettings(input: unknown): Promise<AdminResult> {
  return adminAction(settingsSchema, input, async ({ supabase, user }, values) => {
    const socials = Object.fromEntries(Object.entries(values.socials).filter(([, url]) => url));
    const row = { ...nullIfEmpty({ ...values, socials: undefined }), socials };
    const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
    if (error) return dbError(error, "settings");
    await logAdminAction({
      actor: user.id,
      action: "settings.update",
      entity: "site_settings",
      entityId: "1",
    });
    revalidateSite();
    return { ok: true, message: "Settings saved. The public site is updated." };
  });
}
