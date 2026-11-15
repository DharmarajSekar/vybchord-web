"use server";

import { redirect } from "next/navigation";
import { insertLead, saveFailed } from "@/lib/forms/leads";
import { emailFields, handleSubmission } from "@/lib/forms/submit";
import type { ActionResult } from "@/lib/forms/types";
import { removeUpload, uploadDocument } from "@/lib/forms/uploads";
import { budgetRanges, labelFor, projectTypes, timelines } from "@/lib/validations/options";
import { projectSchema } from "@/lib/validations/project";

/** F2 Project enquiry, with an optional brief attachment. */
export async function submitProject(formData: FormData): Promise<ActionResult> {
  const error = await handleSubmission({
    form: "project",
    formData,
    schema: projectSchema,
    workEmailField: "work_email",
    async save(v) {
      const { name, work_email, company, phone, attachment, consent: _consent, ...payload } = v;

      let attachmentPath: string | undefined;
      if (attachment) {
        const upload = await uploadDocument(attachment, "leads");
        if (!upload.ok) {
          return {
            ok: false,
            message: upload.message,
            fieldErrors: { attachment: upload.message },
          };
        }
        attachmentPath = upload.path;
      }

      const id = await insertLead(
        {
          form_type: "project",
          name,
          email: work_email,
          company,
          phone,
          attachment_path: attachmentPath,
          payload: { ...payload, attachment_name: attachment?.name },
        },
        formData,
      );
      if (!id) {
        if (attachmentPath) await removeUpload(attachmentPath);
        return saveFailed;
      }
      return {
        ok: true,
        title: "New project enquiry",
        visitor: { email: work_email, name },
        adminPath: `/admin/leads/${id}`,
        fields: emailFields([
          ["Name", name],
          ["Work email", work_email],
          ["Company", company],
          ["Phone", phone],
          ["Project type", labelFor(projectTypes, v.project_type)],
          ["Budget", labelFor(budgetRanges, v.budget_range)],
          ["Timeline", labelFor(timelines, v.timeline)],
          ["Attachment", attachment ? `${attachment.name} (download in admin)` : undefined],
          ["Description", v.description],
        ]),
      };
    },
  });
  if (error) return error;
  redirect("/thank-you/project");
}
