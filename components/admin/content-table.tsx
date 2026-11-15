"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "./data-table";
import { formatDateTime } from "@/lib/admin/labels";

export type ContentRow = {
  id: string;
  title: string;
  slug: string;
  /** e.g. product status, business line, job type, post category. */
  kind?: string | null;
  /** Shown live on the site right now. */
  live: boolean;
  liveLabel: string;
  updated_at: string;
  /** e.g. application count for jobs. */
  extra?: string | null;
};

/** List view for products, case studies, posts and jobs. */
export function ContentTable({
  rows,
  editBase,
  publicBase,
  kindLabel,
  extraLabel,
}: {
  rows: ContentRow[];
  editBase: string;
  publicBase: string;
  kindLabel: string;
  extraLabel?: string;
}) {
  const columns: ColumnDef<ContentRow>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link href={`${editBase}/${row.original.id}`} className="font-medium hover:underline">
          {row.original.title}
          <span className="block text-xs font-normal text-muted-foreground">
            /{row.original.slug}
          </span>
        </Link>
      ),
    },
    { accessorKey: "kind", header: kindLabel, cell: ({ row }) => row.original.kind ?? "—" },
    {
      accessorKey: "live",
      header: "On site",
      cell: ({ row }) => (
        <Badge variant={row.original.live ? "default" : "outline"}>{row.original.liveLabel}</Badge>
      ),
    },
    ...(extraLabel
      ? [
          {
            accessorKey: "extra",
            header: extraLabel,
            cell: ({ row }) => row.original.extra ?? "—",
          } satisfies ColumnDef<ContentRow>,
        ]
      : []),
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDateTime(row.original.updated_at)}</span>
      ),
    },
    {
      id: "view",
      header: () => <span className="sr-only">View on site</span>,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.live ? (
          <a
            href={`${publicBase}/${row.original.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="size-4" aria-hidden />
            <span className="sr-only">View {row.original.title} on the site</span>
          </a>
        ) : null,
    },
  ];
  return <DataTable columns={columns} data={rows} empty="Nothing yet. Create the first one." />;
}
