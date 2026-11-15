import type { Job } from "@/lib/data/jobs";
import type { Post } from "@/lib/data/posts";
import type { Product } from "@/lib/data/products";
import type { SiteSettings } from "@/lib/data/site-settings";
import { mdxToText } from "@/lib/format";
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

function organization(name: string | undefined) {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return name ? { "@type": "Organization", name, ...(url ? { url } : {}) } : undefined;
}

/** NFR-2 Article schema for /insights/[slug]. */
export function articleJsonLd(post: Post, publisherName: string | undefined) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image ? [mediaUrl(post.cover_image)] : undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    publisher: organization(publisherName),
    articleSection: post.category ?? undefined,
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
  };
}

const employmentTypes: Record<Job["type"], string> = {
  full_time: "FULL_TIME",
  contract: "CONTRACTOR",
  // Engineers employed by us and deployed into a client team.
  deployment: "OTHER",
};

/** NFR-3 JobPosting schema for Google Jobs. Only open, unexpired jobs reach this. */
export function jobPostingJsonLd(job: Job, hiringOrganization: string | undefined) {
  const description = mdxToText(job.description_mdx)
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim())
    .map(
      (paragraph) =>
        `<p>${paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  const remote = job.work_mode?.toLowerCase() === "remote";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: description || job.title,
    datePosted: job.posted_at,
    validThrough: job.valid_through ?? undefined,
    employmentType: employmentTypes[job.type],
    hiringOrganization: organization(hiringOrganization),
    identifier: hiringOrganization
      ? { "@type": "PropertyValue", name: hiringOrganization, value: job.id }
      : undefined,
    skills: job.skills.length ? job.skills.join(", ") : undefined,
    experienceRequirements: job.experience ?? undefined,
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: "India" },
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.location ?? undefined,
              addressCountry: "IN",
            },
          },
        }),
    directApply: true,
    url: absoluteUrl(`/careers/${job.slug}`),
  };
}

/** NFR-2 Organization schema, from site_settings (CLAUDE.md rule 12). */
export function organizationJsonLd(settings: SiteSettings | null) {
  if (!settings) return null;
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  const sameAs = Object.values(settings.socials).filter((link) => /^https?:\/\//.test(link));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.legal_name,
    alternateName: "Vybchord",
    url,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    taxID: settings.gstin ?? undefined,
    identifier: settings.cin
      ? { "@type": "PropertyValue", propertyID: "CIN", value: settings.cin }
      : undefined,
    address: settings.registered_office
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.registered_office,
          addressCountry: "IN",
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

/** Site-wide Open Graph fields. A page's openGraph replaces the parent's entirely, so pages spread these in. */
export const ogSite = { siteName: "Vybchord", locale: "en_IN" };

/**
 * For pages without their own opengraph-image file: site fields plus the default share image.
 * Pages that have their own image file must use `ogSite` instead, because `images` here would
 * override that file.
 */
export const ogDefaults = {
  ...ogSite,
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vybchord" }],
};
