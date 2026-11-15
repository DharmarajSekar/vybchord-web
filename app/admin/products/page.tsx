import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentTable } from "@/components/admin/content-table";
import { NewButton } from "@/components/admin/new-button";
import { requireAdmin } from "@/lib/admin/auth";
import { productStatusLabel } from "@/lib/admin/labels";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Products" };
}

/** FR-A3 products list. */
export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin("/admin/products");
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, status, published, updated_at, sort_order")
    .order("sort_order")
    .order("name");

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Shown on the home page and /products in display order."
        actions={<NewButton href="/admin/products/new" label="New product" />}
      />
      <ContentTable
        editBase="/admin/products"
        publicBase="/products"
        kindLabel="Status"
        rows={(data ?? []).map((p) => ({
          id: p.id,
          title: p.name,
          slug: p.slug,
          kind: productStatusLabel[p.status],
          live: p.published,
          liveLabel: p.published ? "Published" : "Hidden",
          updated_at: p.updated_at,
        }))}
      />
    </>
  );
}
