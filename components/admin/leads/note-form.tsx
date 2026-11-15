"use client";

import { TextareaField } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/use-lead-form";
import { AdminForm } from "@/components/admin/form/admin-form";
import { addLeadNote } from "@/lib/admin/actions/records";
import { leadNoteSchema } from "@/lib/validations/admin/records";

/** FR-A2 internal note on a lead. */
export function NoteForm({ leadId }: { leadId: string }) {
  const form = useLeadForm(leadNoteSchema, { lead_id: leadId, note: "" });
  return (
    <AdminForm
      form={form}
      action={async (values) => {
        const result = await addLeadNote(values);
        if (result.ok) form.reset({ lead_id: leadId, note: "" });
        return result;
      }}
      submitLabel="Add note"
    >
      <TextareaField control={form.control} name="note" label="New note" rows={3} />
    </AdminForm>
  );
}
