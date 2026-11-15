import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm, emptyProduct } from "@/components/admin/forms/product-form";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "New product" };
}

export default async function NewProductPage() {
  await requireAdmin("/admin/products/new");
  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/products", label: "All products" }}
        title="New product"
      />
      <ProductForm id={null} values={emptyProduct} />
    </>
  );
}
