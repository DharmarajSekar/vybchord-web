import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import {
  RelatedCaseStudies,
  ScopeAndDeliverables,
  ServiceTimeline,
  TechStack,
} from "@/components/site/services/service-details";
import { getService, services } from "@/content/services";
import { getRelatedCaseStudies } from "@/lib/data/case-studies";
import { projectEnquiryHref } from "@/lib/site/navigation";

// Service content is static; related case studies come from the database and refresh hourly.
export const revalidate = 3600;
// Only the service lines in content/services.ts exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: url },
    openGraph: {
      ...ogDefaults,
      title: service.title,
      description: service.summary,
      url,
      type: "website",
    },
  };
}

/** FR-P5 service detail. */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = await getRelatedCaseStudies(service.stack);
  const estimateHref = projectEnquiryHref(service.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
        title={service.title}
        description={service.intro}
      >
        <Link
          href={estimateHref}
          className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
        >
          Get an estimate
        </Link>
      </PageHeader>
      <ScopeAndDeliverables service={service} />
      <ServiceTimeline service={service} />
      <TechStack stack={service.stack} />
      <RelatedCaseStudies studies={related} />
      <CtaBand
        title={`Get an estimate: ${service.title}`}
        description="Send a short brief. We reply within one business day with next steps and a discovery call."
        primary={{ href: estimateHref, label: "Get an estimate" }}
        secondary={{ href: "/services", label: "All services" }}
      />
    </>
  );
}
