import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/legal";
import { services } from "@/content/services";
import { getCaseStudySlugs } from "@/lib/data/case-studies";
import { getJobs } from "@/lib/data/jobs";
import { getPosts } from "@/lib/data/posts";
import { getProductSlugs } from "@/lib/data/products";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** NFR-2 sitemap.xml: every public, indexable page. Thank-you, confirm and admin pages are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) return [];

  const [products, caseStudies, jobs, posts] = await Promise.all([
    getProductSlugs(),
    getCaseStudySlugs(),
    getJobs(),
    getPosts(),
  ]);

  const page = (
    path: string,
    priority: number,
    changeFrequency: Entry["changeFrequency"] = "monthly",
    lastModified?: string,
  ): Entry => ({ url: `${siteUrl}${path}`, priority, changeFrequency, lastModified });

  return [
    page("/", 1, "weekly"),
    page("/products", 0.9, "weekly"),
    ...products.map((slug) => page(`/products/${slug}`, 0.9)),
    page("/services", 0.8),
    ...services.map((service) => page(`/services/${service.slug}`, 0.7)),
    page("/hire-engineers", 0.8),
    page("/case-studies", 0.7, "weekly"),
    ...caseStudies.map((slug) => page(`/case-studies/${slug}`, 0.6)),
    page("/about", 0.6),
    page("/careers", 0.6, "weekly"),
    ...jobs.map((job) => page(`/careers/${job.slug}`, 0.5, "weekly", job.posted_at)),
    page("/insights", 0.6, "weekly"),
    ...posts.map((post) => page(`/insights/${post.slug}`, 0.5, "monthly", post.published_at)),
    page("/contact", 0.7),
    ...Object.entries(legalDocs).map(([doc, meta]) =>
      page(`/legal/${doc}`, 0.2, "yearly", meta.updated),
    ),
  ];
}
