import type { Metadata } from "next";
import { ogSite } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { ScreenshotGallery } from "@/components/site/product/screenshot-gallery";
import { getCaseStudyBySlug, getCaseStudySlugs, type CaseStudy } from "@/lib/data/case-studies";
import { businessLineLabel } from "@/lib/site/labels";
import { bookDemoHref, projectEnquiryHref, staffingEnquiryHref } from "@/lib/site/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const study = await getCaseStudyBySlug((await params).slug);
  if (!study) return { title: "Case study not found", robots: { index: false } };

  const title = study.seo_title ?? study.title;
  const description = study.seo_description ?? study.outcome ?? study.challenge ?? undefined;
  const url = `/case-studies/${study.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...ogSite,
      title,
      description,
      url,
      type: "article",
    },
  };
}

/** The closing CTA follows the study's business line. */
function cta(study: CaseStudy) {
  if (study.line === "products") return { href: bookDemoHref, label: "Book a demo" };
  if (study.line === "staffing") return { href: staffingEnquiryHref(), label: "Request engineers" };
  return { href: projectEnquiryHref(), label: "Start a similar project" };
}

function Story({ id, title, text }: { id: string; title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <div>
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-4 text-lg whitespace-pre-line text-muted-foreground">{text}</p>
    </div>
  );
}

/** FR-P7 case study detail. */
export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const study = await getCaseStudyBySlug((await params).slug);
  if (!study) notFound();
  const client = study.anonymised ? "Confidential client" : study.client_name;

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Case Studies", href: "/case-studies" },
          { name: study.title, href: `/case-studies/${study.slug}` },
        ]}
        eyebrow={
          <>
            <Badge variant="secondary">{businessLineLabel[study.line]}</Badge>
            {study.industry && (
              <span className="text-sm text-muted-foreground">{study.industry}</span>
            )}
          </>
        }
        title={study.title}
        description={client ? `Client: ${client}` : undefined}
      />

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
        <Story id="challenge" title="The challenge" text={study.challenge} />
        <Story id="solution" title="What we built" text={study.solution} />
        {study.outcome?.trim() && (
          <div className="rounded-xl bg-muted/50 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">The outcome</h2>
            <p className="mt-4 text-lg whitespace-pre-line">{study.outcome}</p>
          </div>
        )}
        {study.stack.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
              {study.stack.map((item) => (
                <li key={item}>
                  <Badge variant="outline" className="h-8 px-3 text-sm">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ScreenshotGallery
        name={study.title}
        screenshots={study.images}
        eyebrow="Screenshots"
        title="What we delivered"
      />

      <CtaBand
        title="Have a similar challenge?"
        description="Tell us what you need. We reply within one business day."
        primary={cta(study)}
        secondary={{ href: "/case-studies", label: "More case studies" }}
      />
    </>
  );
}
