import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentTable } from "@/components/admin/content-table";
import { NewButton } from "@/components/admin/new-button";
import { requireAdmin } from "@/lib/admin/auth";
import { businessLineLabel } from "@/lib/site/labels";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Case studies" };
}

/** FR-A4 case studies list. */
export default async function AdminCaseStudiesPage() {
  const { supabase } = await requireAdmin("/admin/case-studies");
  const { data } = await supabase
    .from("case_studies")
    .select("id, title, slug, line, industry, published, updated_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Case studies"
        description="Publish client work only with approval, or anonymise it."
        actions={<NewButton href="/admin/case-studies/new" label="New case study" />}
      />
      <ContentTable
        editBase="/admin/case-studies"
        publicBase="/case-studies"
        kindLabel="Business line"
        rows={(data ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          kind: [businessLineLabel[c.line], c.industry].filter(Boolean).join(" · "),
          live: c.published,
          liveLabel: c.published ? "Published" : "Hidden",
          updated_at: c.updated_at,
        }))}
      />
    </>
  );
}
