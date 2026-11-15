import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { JobForm, emptyJob } from "@/components/admin/forms/job-form";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "New job" };
}

export default async function NewJobPage() {
  await requireAdmin("/admin/jobs/new");
  return (
    <>
      <AdminPageHeader back={{ href: "/admin/jobs", label: "All jobs" }} title="New job" />
      <JobForm id={null} values={emptyJob} />
    </>
  );
}
