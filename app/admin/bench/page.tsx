import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { BenchSearch } from "@/components/admin/bench-search";
import { fetchApplications } from "@/lib/admin/applications";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Talent bench" };
}

/** FR-A7 talent bench: applicants marked "bench", searchable by skill. */
export default async function BenchPage({ searchParams }: PageProps<"/admin/bench">) {
  const params = await searchParams;
  const admin = await requireAdmin("/admin/bench");
  const all = await fetchApplications(admin, { status: "bench" });
  const skill = typeof params.skill === "string" ? params.skill.trim().toLowerCase() : "";
  const rows = skill
    ? all.filter((app) => (app.skills ?? []).some((s) => s.toLowerCase().includes(skill)))
    : all;

  return (
    <>
      <AdminPageHeader
        title="Talent bench"
        description="Candidates set to “Bench” on any application. Tag their skills to find them for staffing requests."
      />
      <Suspense>
        <BenchSearch />
      </Suspense>
      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {rows.length} of {all.length} on the bench
      </p>
      <ApplicationsTable rows={rows} showJob editSkills />
    </>
  );
}
