import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NoteForm } from "@/components/admin/leads/note-form";
import { EraseButton } from "@/components/admin/erase-button";
import { StatusSelect } from "@/components/admin/status-select";
import { eraseLead } from "@/lib/admin/actions/privacy";
import { updateLeadStatus } from "@/lib/admin/actions/records";
import { requireAdmin } from "@/lib/admin/auth";
import {
  formatDateTime,
  formTypeLabel,
  humanize,
  leadStatusLabel,
  toOptions,
} from "@/lib/admin/labels";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Lead" };
}

function Detail({ label, value }: { label: string; value: unknown }) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && !value.length)
  )
    return null;
  const text = Array.isArray(value)
    ? value.join(", ")
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words whitespace-pre-line">{text}</dd>
    </div>
  );
}

/** FR-A2 lead detail: all fields, status, attachment download and notes. */
export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/leads/${id}`);
  const [{ data: lead }, { data: notes }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("lead_notes")
      .select("id, note, created_at")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (!lead) notFound();
  const payload = (lead.payload ?? {}) as Record<string, unknown>;

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/leads", label: "All leads" }}
        title={lead.name ?? lead.email}
        description={`${formTypeLabel[lead.form_type]} · received ${formatDateTime(lead.created_at)}`}
        actions={
          <>
            <StatusSelect
              id={lead.id}
              value={lead.status}
              options={toOptions(leadStatusLabel)}
              action={updateLeadStatus}
              label="Lead status"
            />
            <EraseButton
              id={lead.id}
              name={lead.name ?? lead.email}
              what="lead, its notes and any attachment"
              action={eraseLead}
              redirectTo="/admin/leads"
            />
          </>
        }
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section aria-labelledby="details-title" className="space-y-6">
          <div className="rounded-xl p-5 ring-1 ring-foreground/10">
            <h2 id="details-title" className="mb-2 font-semibold">
              Details
            </h2>
            <dl className="divide-y">
              <Detail label="Email" value={lead.email} />
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Company" value={lead.company} />
              {Object.entries(payload)
                .filter(([key]) => !["token_hash"].includes(key))
                .map(([key, value]) => (
                  <Detail key={key} label={humanize(key)} value={value} />
                ))}
            </dl>
            {lead.attachment_path && (
              <a
                href={`/admin/files?path=${encodeURIComponent(lead.attachment_path)}`}
                className={buttonVariants({ variant: "outline", className: "mt-4" })}
              >
                <DownloadIcon aria-hidden />
                Download attachment
              </a>
            )}
          </div>
          <div className="rounded-xl p-5 ring-1 ring-foreground/10">
            <h2 className="mb-2 font-semibold">Source and consent</h2>
            <dl className="divide-y">
              <Detail label="Submitted from" value={lead.source_page} />
              <Detail
                label="Campaign (UTM)"
                value={Object.keys(lead.utm ?? {}).length ? lead.utm : null}
              />
              <Detail label="Consent given" value={formatDateTime(lead.consent_at)} />
              <Detail label="Last updated" value={formatDateTime(lead.updated_at)} />
            </dl>
          </div>
        </section>
        <section aria-labelledby="notes-title" className="space-y-4">
          <h2 id="notes-title" className="font-semibold">
            Notes
          </h2>
          <NoteForm leadId={lead.id} />
          <ul className="space-y-3">
            {(notes ?? []).map((note) => (
              <li key={note.id} className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm whitespace-pre-line">{note.note}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDateTime(note.created_at)}
                </p>
              </li>
            ))}
            {!notes?.length && (
              <li>
                <Badge variant="outline">No notes yet</Badge>
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
