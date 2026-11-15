import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { productStatusLabel } from "@/components/site/product-card";
import type { Product } from "@/lib/data/products";
import { productEnquiryHref } from "@/lib/site/navigation";

/** FR-P3 header with the two primary CTAs: Book a demo / Licensing enquiry. */
export function ProductHero({ product }: { product: Product }) {
  return (
    <section aria-labelledby="product-title" className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          crumbs={[
            { name: "Products", href: "/products" },
            { name: product.name, href: `/products/${product.slug}` },
          ]}
        />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {product.domain && <p className="text-sm text-muted-foreground">{product.domain}</p>}
          <Badge variant={product.status === "live" ? "default" : "secondary"}>
            {productStatusLabel[product.status]}
          </Badge>
        </div>
        <h1
          id="product-title"
          className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          {product.name}
        </h1>
        {product.tagline && (
          <p className="mt-4 max-w-3xl text-xl text-pretty text-muted-foreground">
            {product.tagline}
          </p>
        )}
        {product.summary && <p className="mt-4 max-w-3xl text-pretty">{product.summary}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={productEnquiryHref(product.slug, "demo")}
            className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
          >
            Book a demo
          </Link>
          <Link
            href={productEnquiryHref(product.slug, "licence")}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-11 px-5 text-base",
            })}
          >
            Licensing enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
