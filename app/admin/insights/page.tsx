import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentTable } from "@/components/admin/content-table";
import { NewButton } from "@/components/admin/new-button";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateTime } from "@/lib/admin/labels";
import { postState } from "@/lib/admin/mappers";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Insights" };
}

/** FR-A5 articles list: drafts, scheduled and published. */
export default async function AdminInsightsPage() {
  const { supabase } = await requireAdmin("/admin/insights");
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, category, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: true });

  return (
    <>
      <AdminPageHeader
        title="Insights"
        description="Drafts have no publish date. Scheduled posts go live within an hour of their date."
        actions={<NewButton href="/admin/insights/new" label="New article" />}
      />
      <ContentTable
        editBase="/admin/insights"
        publicBase="/insights"
        kindLabel="Category"
        extraLabel="Publish date"
        rows={(data ?? []).map((p) => {
          const state = postState(p.published_at);
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            kind: p.category,
            live: state.live,
            liveLabel: state.label,
            extra: p.published_at ? formatDateTime(p.published_at) : null,
            updated_at: p.updated_at,
          };
        })}
      />
    </>
  );
}
