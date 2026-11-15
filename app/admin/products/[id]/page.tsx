import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { ProductForm } from "@/components/admin/forms/product-form";
import { requireAdmin } from "@/lib/admin/auth";
import { productToForm } from "@/lib/admin/mappers";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit product" };
}

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/products/${id}`);
  const { data: row } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  const values = productToForm(row);
  const title = values.name;

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/products", label: "All products" }}
        title={title}
        actions={
          <DeleteButton table="products" id={row.id} name={title} listHref="/admin/products" />
        }
      />
      <ProductForm id={row.id} values={values} />
    </>
  );
}
