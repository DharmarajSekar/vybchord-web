import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { DeploymentOptions } from "@/components/site/product/deployment-options";
import { LicensingOptions } from "@/components/site/product/licensing-options";
import {
  ModulesGrid,
  ProductProblem,
  SecurityNotes,
} from "@/components/site/product/product-features";
import { ProductFaqs } from "@/components/site/product/product-faqs";
import { ProductHero } from "@/components/site/product/product-hero";
import { ScreenshotGallery } from "@/components/site/product/screenshot-gallery";
import { getProductBySlug, getProductSlugs } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";
import { productEnquiryHref } from "@/lib/site/navigation";
import { productJsonLd, ogSite } from "@/lib/seo";

// Published products are prebuilt; new ones render on first request, then refresh hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const title =
    product.seo_title ?? `${product.name}${product.tagline ? ` — ${product.tagline}` : ""}`;
  const description = product.seo_description ?? product.summary ?? product.tagline ?? undefined;
  const url = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...ogSite,
      title,
      description,
      url,
      type: "website",
    },
  };
}

/** FR-P3 product detail. */
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={productJsonLd(product, settings?.legal_name)} />
      <ProductHero product={product} />
      <ProductProblem problem={product.problem} />
      <ScreenshotGallery name={product.name} screenshots={product.screenshots} />
      <ModulesGrid modules={product.modules} />
      <DeploymentOptions options={product.deployment_options} />
      <SecurityNotes notes={product.security_notes} />
      <LicensingOptions slug={product.slug} name={product.name} />
      <ProductFaqs faqs={product.faqs} />
      <CtaBand
        title={`See ${product.name} in action`}
        description="Book a demo. We reply within one business day with times that suit you."
        primary={{ href: productEnquiryHref(product.slug, "demo"), label: "Book a demo" }}
        secondary={{
          href: productEnquiryHref(product.slug, "licence"),
          label: "Licensing enquiry",
        }}
      />
    </>
  );
}
