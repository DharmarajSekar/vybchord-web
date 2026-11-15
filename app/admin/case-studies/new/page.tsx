import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CaseStudyForm, emptyCaseStudy } from "@/components/admin/forms/case-study-form";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "New case study" };
}

export default async function NewCaseStudyPage() {
  await requireAdmin("/admin/case-studies/new");
  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/case-studies", label: "All case studies" }}
        title="New case study"
      />
      <CaseStudyForm id={null} values={emptyCaseStudy} />
    </>
  );
}
