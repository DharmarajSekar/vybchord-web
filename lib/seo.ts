import type { Product } from "@/lib/data/products";
import { mediaUrl } from "@/lib/media";

/** Absolute URL for JSON-LD, which (unlike metadata) is not resolved against metadataBase. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  return `${base}${path}`;
}

export type Crumb = { name: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/** NFR-2 Product schema. No offers/ratings: pricing is by enquiry and we publish no reviews. */
export function productJsonLd(product: Product, brandName: string | undefined) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seo_description ?? product.summary ?? product.tagline ?? undefined,
    category: product.domain ?? undefined,
    url: absoluteUrl(`/products/${product.slug}`),
    image: product.screenshots.length > 0 ? product.screenshots.map(mediaUrl) : undefined,
    brand: brandName ? { "@type": "Organization", name: brandName } : undefined,
  };
}
