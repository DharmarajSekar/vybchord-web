import type { NextRequest } from "next/server";
import { logAdminAction } from "@/lib/admin/audit";
import { getAdmin } from "@/lib/admin/auth";
import { fetchLeads, readLeadFilters } from "@/lib/admin/leads";

/** CSV cell: quoted, and formula-like values prefixed so spreadsheets do not execute them. */
function cell(value: unknown): string {
  let text =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** FR-A2 CSV export of the leads list, honouring the same filters as the inbox. */
export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return new Response("Not found", { status: 404 });

  const rows = await fetchLeads(admin, readLeadFilters(request.nextUrl.searchParams));
  const header = [
    "created_at",
    "form_type",
    "status",
    "name",
    "email",
    "phone",
    "company",
    "source_page",
    "utm",
    "details",
    "has_attachment",
  ];
  const lines = rows.map((row) =>
    [
      row.created_at,
      row.form_type,
      row.status,
      row.name,
      row.email,
      row.phone,
      row.company,
      row.source_page,
      row.utm,
      row.payload,
      row.attachment_path ? "yes" : "no",
    ]
      .map(cell)
      .join(","),
  );

  await logAdminAction({
    actor: admin.user.id,
    action: "leads.export",
    entity: "lead",
    meta: { rows: rows.length },
  });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${[header.join(","), ...lines].join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vybchord-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
