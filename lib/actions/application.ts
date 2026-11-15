"use server";

import { redirect } from "next/navigation";
import { readAttribution } from "@/lib/forms/parse";
import { saveFailed } from "@/lib/forms/leads";
import { emailFields, handleSubmission } from "@/lib/forms/submit";
import type { ActionResult } from "@/lib/forms/types";
import { removeUpload, uploadDocument } from "@/lib/forms/uploads";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicationSchema } from "@/lib/validations/application";

/** F4 Job application: CV to the private bucket, row in `applications`. */
export async function submitApplication(formData: FormData): Promise<ActionResult> {
  const error = await handleSubmission({
    form: "application",
    formData,
    schema: applicationSchema,
    async save(v) {
      const supabase = createAdminClient();
      const { data: job } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("id", v.job_id)
        .eq("is_open", true)
        .maybeSingle();
      if (!job) return { ok: false, message: "This role is no longer open for applications." };

      const upload = await uploadDocument(v.cv, "cvs");
      if (!upload.ok)
        return { ok: false, message: upload.message, fieldErrors: { cv: upload.message } };

      const { source_page } = readAttribution(formData);
      const { data, error: insertError } = await supabase
        .from("applications")
        .insert({
          job_id: job.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          experience_years: v.experience_years,
          cv_path: upload.path,
          links: { linkedin: v.linkedin, github: v.github, portfolio: v.portfolio, source_page },
          notice_period: v.notice_period ?? null,
          location: v.location ?? null,
          expected_ctc: v.expected_ctc ?? null,
          consent_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("[applications] insert failed", insertError.message);
        await removeUpload(upload.path);
        return saveFailed;
      }

      return {
        ok: true,
        title: `New application: ${job.title}`,
        visitor: { email: v.email, name: v.name },
        adminPath: `/admin/jobs/${job.id}?application=${data.id}`,
        fields: emailFields([
          ["Role", job.title],
          ["Name", v.name],
          ["Email", v.email],
          ["Phone", v.phone],
          ["Experience (years)", v.experience_years],
          ["Notice period", v.notice_period],
          ["Location", v.location],
          ["Expected CTC", v.expected_ctc],
          ["LinkedIn", v.linkedin],
          ["GitHub", v.github],
          ["Portfolio", v.portfolio],
          ["CV", "Download in admin"],
        ]),
      };
    },
  });
  if (error) return error;
  redirect("/thank-you/application");
}
