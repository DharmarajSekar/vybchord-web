import type { Metadata } from "next";
import { DownloadIcon } from "lucide-react";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadFilters } from "@/components/admin/leads/lead-filters";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import { requireAdmin } from "@/lib/admin/auth";
import { fetchLeads, readLeadFilters } from "@/lib/admin/leads";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Leads" };
}

/** FR-A2 leads inbox. */
export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const params = await searchParams;
  const admin = await requireAdmin("/admin/leads");
  const filters = readLeadFilters(params);
  const rows = await fetchLeads(admin, filters);
  const query = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Every enquiry from the website forms, newest first."
        actions={
          <a
            href={`/admin/leads/export${query ? `?${query}` : ""}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <DownloadIcon aria-hidden />
            Export CSV
          </a>
        }
      />
      <Suspense>
        <LeadFilters />
      </Suspense>
      <LeadsTable rows={rows} />
    </>
  );
}
