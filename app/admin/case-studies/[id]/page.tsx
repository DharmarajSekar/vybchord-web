import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { CaseStudyForm } from "@/components/admin/forms/case-study-form";
import { requireAdmin } from "@/lib/admin/auth";
import { caseStudyToForm } from "@/lib/admin/mappers";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit case study" };
}

export default async function EditCaseStudyPage({ params }: PageProps<"/admin/case-studies/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/case-studies/${id}`);
  const { data: row } = await supabase.from("case_studies").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  const values = caseStudyToForm(row);
  const title = values.title;

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/case-studies", label: "All case studies" }}
        title={title}
        actions={
          <DeleteButton
            table="case_studies"
            id={row.id}
            name={title}
            listHref="/admin/case-studies"
          />
        }
      />
      <CaseStudyForm id={row.id} values={values} />
    </>
  );
}
