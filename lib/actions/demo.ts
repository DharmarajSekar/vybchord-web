"use server";

import { redirect } from "next/navigation";
import { insertLead, saveFailed } from "@/lib/forms/leads";
import { emailFields, handleSubmission } from "@/lib/forms/submit";
import type { ActionResult } from "@/lib/forms/types";
import { demoSchema } from "@/lib/validations/demo";
import { companySizes, interestTypes, labelFor, timelines } from "@/lib/validations/options";

/** F1 Product demo / licensing. */
export async function submitDemo(formData: FormData): Promise<ActionResult> {
  const error = await handleSubmission({
    form: "demo",
    formData,
    schema: demoSchema,
    workEmailField: "work_email",
    async save(v) {
      const { name, work_email, company, phone, consent: _consent, ...payload } = v;
      const id = await insertLead(
        { form_type: "demo", name, email: work_email, company, phone, payload },
        formData,
      );
      if (!id) return saveFailed;
      return {
        ok: true,
        title: "New demo / licensing request",
        visitor: { email: work_email, name },
        adminPath: `/admin/leads/${id}`,
        fields: emailFields([
          ["Name", name],
          ["Work email", work_email],
          ["Company", company],
          ["Phone", phone],
          ["Product", v.product],
          ["Interest", labelFor(interestTypes, v.interest_type)],
          ["Company size", labelFor(companySizes, v.company_size)],
          ["Timeline", labelFor(timelines, v.timeline)],
          ["Message", v.message],
        ]),
      };
    },
  });
  if (error) return error;
  redirect("/thank-you/demo");
}
