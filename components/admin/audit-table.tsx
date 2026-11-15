"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { formatDateTime } from "@/lib/admin/labels";

type AuditRow = {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  entity: string;
  meta: string;
};

const columns: ColumnDef<AuditRow>[] = [
  {
    accessorKey: "created_at",
    header: "When",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDateTime(row.original.created_at)}</span>
    ),
  },
  { accessorKey: "actor", header: "Who" },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <code className="text-xs">{row.original.action}</code>,
  },
  {
    accessorKey: "entity",
    header: "Record",
    cell: ({ row }) => <span className="break-all">{row.original.entity}</span>,
  },
  {
    accessorKey: "meta",
    header: "Details",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs break-all text-muted-foreground">{row.original.meta}</span>
    ),
  },
];

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  return <DataTable columns={columns} data={rows} empty="No admin actions yet." pageSize={50} />;
}
