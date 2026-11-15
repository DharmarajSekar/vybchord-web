import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { ProductCard } from "@/components/site/product-card";
import { getProducts } from "@/lib/data/products";
import { bookDemoHref, contactHref } from "@/lib/site/navigation";

export const revalidate = 3600;

const title = "Products";
const description =
  "AI-native enterprise platforms for HR, legal and real estate. Available as SaaS, enterprise licence, white-label or full IP transfer.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/products",
      type: "website",
    },
  };
}

/** FR-P2 products overview. */
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Products", href: "/products" }]}
        title="Platforms you can deploy now"
        description={description}
      />

      <section aria-label="Product list" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Our product pages are being updated. Contact us for a walkthrough.
            </p>
          )}
        </div>
      </section>

      <CtaBand
        title="See a product on your own data"
        description="Book a demo and we will walk you through the modules that matter to your team."
        primary={{ href: bookDemoHref, label: "Book a demo" }}
        secondary={{ href: contactHref, label: "Contact us" }}
      />
    </>
  );
}
