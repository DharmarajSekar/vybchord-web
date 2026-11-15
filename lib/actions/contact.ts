"use server";

import { redirect } from "next/navigation";
import { insertLead, saveFailed } from "@/lib/forms/leads";
import { emailFields, handleSubmission } from "@/lib/forms/submit";
import type { ActionResult } from "@/lib/forms/types";
import { contactSchema } from "@/lib/validations/contact";
import { contactTopics, labelFor } from "@/lib/validations/options";

/** F5 General contact. */
export async function submitContact(formData: FormData): Promise<ActionResult> {
  const error = await handleSubmission({
    form: "contact",
    formData,
    schema: contactSchema,
    async save(v) {
      const { name, email, company, phone, consent: _consent, ...payload } = v;
      const id = await insertLead(
        { form_type: "contact", name, email, company, phone, payload },
        formData,
      );
      if (!id) return saveFailed;
      return {
        ok: true,
        title: `New message: ${labelFor(contactTopics, v.topic)}`,
        visitor: { email, name },
        adminPath: `/admin/leads/${id}`,
        fields: emailFields([
          ["Name", name],
          ["Email", email],
          ["Company", company],
          ["Phone", phone],
          ["Topic", labelFor(contactTopics, v.topic)],
          ["Message", v.message],
        ]),
      };
    },
  });
  if (error) return error;
  redirect("/thank-you/contact");
}
