"use server";

import { redirect } from "next/navigation";
import { insertLead, saveFailed } from "@/lib/forms/leads";
import { emailFields, handleSubmission } from "@/lib/forms/submit";
import type { ActionResult } from "@/lib/forms/types";
import {
  engagementModels,
  labelFor,
  roleOptions,
  workModeOptions,
} from "@/lib/validations/options";
import { staffingSchema } from "@/lib/validations/staffing";

/** F3 Staff augmentation request. */
export async function submitStaffing(formData: FormData): Promise<ActionResult> {
  const error = await handleSubmission({
    form: "staffing",
    formData,
    schema: staffingSchema,
    arrays: ["roles"],
    workEmailField: "work_email",
    async save(v) {
      const { name, work_email, company, consent: _consent, ...payload } = v;
      const id = await insertLead(
        { form_type: "staffing", name, email: work_email, company, payload },
        formData,
      );
      if (!id) return saveFailed;
      return {
        ok: true,
        title: "New engineer request",
        visitor: { email: work_email, name },
        adminPath: `/admin/leads/${id}`,
        fields: emailFields([
          ["Name", name],
          ["Work email", work_email],
          ["Company", company],
          ["Roles", v.roles.map((role) => labelFor(roleOptions, role)).join(", ")],
          ["Headcount", v.headcount],
          ["Start date", v.start_date],
          ["Duration (months)", v.duration_months],
          ["Engagement model", labelFor(engagementModels, v.engagement_model)],
          ["Work mode", labelFor(workModeOptions, v.work_mode)],
          ["Location", v.location],
          ["Skills", v.skills],
          ["Budget per resource", v.budget_per_resource],
        ]),
      };
    },
  });
  if (error) return error;
  redirect("/thank-you/staffing");
}
