import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { JobForm } from "@/components/admin/forms/job-form";
import { fetchApplications } from "@/lib/admin/applications";
import { requireAdmin } from "@/lib/admin/auth";
import { jobToForm } from "@/lib/admin/mappers";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit job" };
}

/** FR-A6 job editor plus its applications. `?application=` highlights one (from the alert email). */
export default async function EditJobPage({ params, searchParams }: PageProps<"/admin/jobs/[id]">) {
  const { id } = await params;
  const highlight = (await searchParams).application;
  const admin = await requireAdmin(`/admin/jobs/${id}`);
  const [{ data: job }, applications] = await Promise.all([
    admin.supabase.from("jobs").select("*").eq("id", id).maybeSingle(),
    fetchApplications(admin, { jobId: id }),
  ]);
  if (!job) notFound();

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/jobs", label: "All jobs" }}
        title={job.title}
        actions={<DeleteButton table="jobs" id={job.id} name={job.title} listHref="/admin/jobs" />}
      />
      <section aria-labelledby="applications-title" className="mb-10">
        <h2 id="applications-title" className="mb-3 font-semibold">
          Applications ({applications.length})
        </h2>
        <ApplicationsTable
          rows={applications}
          highlight={typeof highlight === "string" ? highlight : undefined}
        />
      </section>
      <h2 className="mb-4 font-semibold">Job details</h2>
      <JobForm id={job.id} values={jobToForm(job)} />
    </>
  );
}
