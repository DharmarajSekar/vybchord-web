"use server";

import { z } from "zod";
import { adminAction } from "@/lib/admin/action";
import { logAdminAction } from "@/lib/admin/audit";
import { dbError, type AdminResult } from "@/lib/admin/result";
import { runRetention } from "@/lib/admin/retention";
import { getAdmin } from "@/lib/admin/auth";
import { notAuthorised } from "@/lib/admin/result";
import { createAdminClient } from "@/lib/supabase/admin";

const idOnly = z.object({ id: z.uuid() });

async function removeFile(path: string | null) {
  if (!path) return;
  const { error } = await createAdminClient().storage.from("uploads").remove([path]);
  if (error) throw new Error(error.message);
}

/** NFR-6 erasure on request: deletes a lead, its notes and its attachment. */
export async function eraseLead(input: unknown): Promise<AdminResult> {
  return adminAction(idOnly, input, async ({ supabase, user }, { id }) => {
    const { data: lead } = await supabase
      .from("leads")
      .select("form_type, attachment_path")
      .eq("id", id)
      .maybeSingle();
    if (!lead) return { ok: false, message: "This lead no longer exists." };
    try {
      await removeFile(lead.attachment_path);
    } catch (error) {
      console.error("[privacy] attachment delete failed", error);
      return {
        ok: false,
        message: "Could not delete the attachment, so the lead was kept. Try again.",
      };
    }
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return dbError(error, "lead");
    // No personal data in the audit entry: only what was erased.
    await logAdminAction({
      actor: user.id,
      action: "lead.erase",
      entity: "lead",
      entityId: id,
      meta: { form_type: lead.form_type, attachment: Boolean(lead.attachment_path) },
    });
    return { ok: true, message: "Lead and its data deleted" };
  });
}

/** NFR-6 erasure on request: deletes an application and its CV. */
export async function eraseApplication(input: unknown): Promise<AdminResult> {
  return adminAction(idOnly, input, async ({ supabase, user }, { id }) => {
    const { data: app } = await supabase
      .from("applications")
      .select("cv_path")
      .eq("id", id)
      .maybeSingle();
    if (!app) return { ok: false, message: "This application no longer exists." };
    try {
      await removeFile(app.cv_path);
    } catch (error) {
      console.error("[privacy] CV delete failed", error);
      return {
        ok: false,
        message: "Could not delete the CV, so the application was kept. Try again.",
      };
    }
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return dbError(error, "application");
    await logAdminAction({
      actor: user.id,
      action: "application.erase",
      entity: "application",
      entityId: id,
    });
    return { ok: true, message: "Application and CV deleted" };
  });
}

/** NFR-6 retention, run on demand from the dashboard (the cron endpoint runs it daily). */
export async function runRetentionNow(): Promise<AdminResult> {
  const admin = await getAdmin();
  if (!admin) return notAuthorised;
  try {
    const r = await runRetention(admin.user.id);
    return {
      ok: true,
      message: `Deleted ${r.applications} old applications (${r.files} CVs), ${r.unconfirmedSubscribers} unconfirmed sign-ups and ${r.rateLimits} spam-protection records.`,
    };
  } catch (error) {
    console.error("[privacy] retention failed", error);
    return { ok: false, message: "Retention did not finish. Check the server logs and try again." };
  }
}
