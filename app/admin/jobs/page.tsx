import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { ContentTable } from "@/components/admin/content-table";
import { NewButton } from "@/components/admin/new-button";
import { fetchApplications } from "@/lib/admin/applications";
import { requireAdmin } from "@/lib/admin/auth";
import { jobTypeLabel } from "@/lib/site/labels";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Jobs & applications" };
}

/** FR-A6 jobs with application counts, and every application. */
export default async function AdminJobsPage() {
  const admin = await requireAdmin("/admin/jobs");
  const [{ data: jobs }, applications] = await Promise.all([
    admin.supabase
      .from("jobs")
      .select("id, title, slug, type, location, is_open, updated_at")
      .order("posted_at", { ascending: false }),
    fetchApplications(admin),
  ]);
  const counts = new Map<string, { total: number; fresh: number }>();
  for (const app of applications) {
    if (!app.job) continue;
    const entry = counts.get(app.job.id) ?? { total: 0, fresh: 0 };
    entry.total += 1;
    if (app.status === "new") entry.fresh += 1;
    counts.set(app.job.id, entry);
  }

  return (
    <>
      <AdminPageHeader
        title="Jobs & applications"
        description="Untick “Open” on a job to close the role."
        actions={<NewButton href="/admin/jobs/new" label="New job" />}
      />
      <ContentTable
        editBase="/admin/jobs"
        publicBase="/careers"
        kindLabel="Type"
        extraLabel="Applications"
        rows={(jobs ?? []).map((job) => {
          const count = counts.get(job.id);
          return {
            id: job.id,
            title: job.title,
            slug: job.slug,
            kind: [jobTypeLabel[job.type], job.location].filter(Boolean).join(" · "),
            live: job.is_open,
            liveLabel: job.is_open ? "Open" : "Closed",
            extra: count ? `${count.total}${count.fresh ? ` (${count.fresh} new)` : ""}` : "0",
            updated_at: job.updated_at,
          };
        })}
      />
      <h2 className="mt-10 mb-3 font-semibold">All applications</h2>
      <ApplicationsTable rows={applications} showJob />
    </>
  );
}
