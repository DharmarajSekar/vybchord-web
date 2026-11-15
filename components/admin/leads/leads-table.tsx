"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PaperclipIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { formatDateTime, formTypeLabel, leadStatusLabel } from "@/lib/admin/labels";
import type { Enums } from "@/lib/supabase/types";

export type LeadListRow = {
  id: string;
  created_at: string;
  form_type: Enums<"lead_form_type">;
  status: Enums<"lead_status">;
  name: string | null;
  email: string;
  company: string | null;
  attachment_path: string | null;
};

const columns: ColumnDef<LeadListRow>[] = [
  {
    accessorKey: "created_at",
    header: "Received",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDateTime(row.original.created_at)}</span>
    ),
  },
  {
    accessorKey: "form_type",
    header: "Type",
    cell: ({ row }) => <Badge variant="secondary">{formTypeLabel[row.original.form_type]}</Badge>,
  },
  {
    accessorKey: "name",
    header: "From",
    cell: ({ row }) => (
      <Link href={`/admin/leads/${row.original.id}`} className="block font-medium hover:underline">
        {row.original.name ?? row.original.email}
        <span className="block text-xs font-normal text-muted-foreground">
          {row.original.email}
        </span>
      </Link>
    ),
  },
  { accessorKey: "company", header: "Company", cell: ({ row }) => row.original.company ?? "—" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "new" ? "default" : "outline"}>
        {leadStatusLabel[row.original.status]}
      </Badge>
    ),
  },
  {
    id: "attachment",
    header: () => <span className="sr-only">Attachment</span>,
    cell: ({ row }) =>
      row.original.attachment_path ? (
        <PaperclipIcon className="size-4 text-muted-foreground" aria-label="Has attachment" />
      ) : null,
    enableSorting: false,
  },
];

export function LeadsTable({ rows }: { rows: LeadListRow[] }) {
  return <DataTable columns={columns} data={rows} empty="No leads match these filters." />;
}
