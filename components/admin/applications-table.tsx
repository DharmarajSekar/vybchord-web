"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { FileDownIcon } from "lucide-react";
import { DataTable } from "./data-table";
import { SkillsEditor } from "./skills-editor";
import { StatusSelect } from "./status-select";
import { updateApplicationStatus } from "@/lib/admin/actions/records";
import { appStatusLabel, formatDateTime, toOptions } from "@/lib/admin/labels";
import type { Enums, Json } from "@/lib/supabase/types";

export type ApplicationRow = {
  id: string;
  created_at: string;
  status: Enums<"app_status">;
  name: string;
  email: string;
  phone: string;
  experience_years: number | null;
  notice_period: string | null;
  location: string | null;
  expected_ctc: string | null;
  cv_path: string;
  links: Json | null;
  skills: string[] | null;
  job: { id: string; title: string } | null;
};

const statusOptions = toOptions(appStatusLabel);

function Links({ links }: { links: Json | null }) {
  const entries = Object.entries((links ?? {}) as Record<string, unknown>).filter(
    ([key, url]) => key !== "source_page" && typeof url === "string" && /^https?:\/\//.test(url),
  );
  if (!entries.length) return <>—</>;
  return (
    <span className="flex flex-col">
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="capitalize underline-offset-4 hover:underline"
        >
          {key}
        </a>
      ))}
    </span>
  );
}

/** FR-A6/A7 applications with CV download, status flow and (on the bench) skills. */
export function ApplicationsTable({
  rows,
  showJob = false,
  editSkills = false,
  highlight,
}: {
  rows: ApplicationRow[];
  showJob?: boolean;
  editSkills?: boolean;
  highlight?: string;
}) {
  const columns: ColumnDef<ApplicationRow>[] = [
    {
      accessorKey: "created_at",
      header: "Applied",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Candidate",
      cell: ({ row }) => (
        <span className="block">
          <span className="font-medium">{row.original.name}</span>
          <a
            href={`mailto:${row.original.email}`}
            className="block text-xs text-muted-foreground hover:underline"
          >
            {row.original.email}
          </a>
          <span className="block text-xs text-muted-foreground">{row.original.phone}</span>
        </span>
      ),
    },
    ...(showJob
      ? [
          {
            id: "job",
            header: "Role",
            accessorFn: (r: ApplicationRow) => r.job?.title ?? "",
            cell: ({ row }: { row: { original: ApplicationRow } }) =>
              row.original.job ? (
                <Link href={`/admin/jobs/${row.original.job.id}`} className="hover:underline">
                  {row.original.job.title}
                </Link>
              ) : (
                "Role deleted"
              ),
          } satisfies ColumnDef<ApplicationRow>,
        ]
      : []),
    {
      accessorKey: "experience_years",
      header: "Exp. (yrs)",
      cell: ({ row }) => row.original.experience_years ?? "—",
    },
    {
      id: "details",
      header: "Notice · Location · CTC",
      enableSorting: false,
      cell: ({ row }) =>
        [row.original.notice_period, row.original.location, row.original.expected_ctc]
          .filter(Boolean)
          .join(" · ") || "—",
    },
    {
      id: "links",
      header: "Links",
      enableSorting: false,
      cell: ({ row }) => <Links links={row.original.links} />,
    },
    ...(editSkills
      ? [
          {
            id: "skills",
            header: "Skills",
            enableSorting: false,
            cell: ({ row }: { row: { original: ApplicationRow } }) => (
              <SkillsEditor id={row.original.id} skills={row.original.skills ?? []} />
            ),
          } satisfies ColumnDef<ApplicationRow>,
        ]
      : []),
    {
      id: "cv",
      header: "CV",
      enableSorting: false,
      cell: ({ row }) => (
        <a
          href={`/admin/files?path=${encodeURIComponent(row.original.cv_path)}`}
          className="inline-flex items-center gap-1 hover:underline"
        >
          <FileDownIcon className="size-4" aria-hidden />
          Download
        </a>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusSelect
          id={row.original.id}
          value={row.original.status}
          options={statusOptions}
          action={updateApplicationStatus}
          label={`Status for ${row.original.name}`}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      empty="No applications yet."
      isHighlighted={highlight ? (row) => row.id === highlight : undefined}
    />
  );
}
