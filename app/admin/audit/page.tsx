import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AuditTable } from "@/components/admin/audit-table";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Audit log" };
}

/** FR-A9 audit log: every admin action with its time. Read-only; entries are written server-side. */
export default async function AuditPage() {
  const { supabase } = await requireAdmin("/admin/audit");
  const [{ data: entries }, { data: admins }] = await Promise.all([
    supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("admins").select("user_id, email"),
  ]);
  const emails = new Map((admins ?? []).map((a) => [a.user_id, a.email]));

  return (
    <>
      <AdminPageHeader title="Audit log" description="The latest 500 admin actions." />
      <AuditTable
        rows={(entries ?? []).map((entry) => ({
          id: String(entry.id),
          created_at: entry.created_at,
          actor: (entry.actor && emails.get(entry.actor)) ?? entry.actor ?? "—",
          action: entry.action,
          entity: [entry.entity, entry.entity_id].filter(Boolean).join(" · ") || "—",
          meta: entry.meta && Object.keys(entry.meta).length ? JSON.stringify(entry.meta) : "",
        }))}
      />
    </>
  );
}
