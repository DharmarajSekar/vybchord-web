import { logAdminAction } from "@/lib/admin/audit";
import { getAdmin } from "@/lib/admin/auth";

const TABLES = [
  "leads",
  "lead_notes",
  "applications",
  "products",
  "case_studies",
  "posts",
  "jobs",
  "site_settings",
  "admins",
  "admin_audit_log",
] as const;

/**
 * NFR-11 full JSON export of the site's data, as a backup alongside Supabase's daily backups.
 * Admin only; uploaded files (CVs, attachments) stay in storage and are not included.
 */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Not found", { status: 404 });

  const data: Record<string, unknown> = { exported_at: new Date().toISOString() };
  for (const table of TABLES) {
    const { data: rows, error } = await admin.supabase.from(table).select("*").limit(50_000);
    if (error) return new Response(`Export failed on ${table}`, { status: 500 });
    data[table] = rows;
  }

  await logAdminAction({ actor: admin.user.id, action: "data.export", entity: "system" });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="vybchord-backup-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
