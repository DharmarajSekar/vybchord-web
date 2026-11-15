import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { Section } from "@/components/site/section";
import type { ProductSummary } from "@/lib/data/products";

/** FR-P1: products come first — they are the primary business line. */
export function ProductShowcase({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;

  return (
    <Section
      id="products"
      eyebrow="Products"
      title="Platforms you can deploy now"
      description="Our own products, built for enterprises. Use them as SaaS, license them on-premise, white-label them, or take full ownership of the IP."
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-1 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        All products
        <ArrowRightIcon className="size-4" aria-hidden />
      </Link>
    </Section>
  );
}
