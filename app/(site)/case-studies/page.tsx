import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseStudyBrowser } from "@/components/site/case-studies/case-study-browser";
import { CaseStudyGrid } from "@/components/site/case-studies/case-study-grid";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { getCaseStudies, getCaseStudyIndustries } from "@/lib/data/case-studies";
import { contactHref, projectEnquiryHref } from "@/lib/site/navigation";

export const revalidate = 3600;

const title = "Case studies";
const description =
  "Products, client projects and engineering teams we have delivered: the challenge, what we built and the outcome.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/case-studies" },
    openGraph: { title, description, url: "/case-studies", type: "website" },
  };
}

/** FR-P7 case study list. Static; filters run in the browser and live in the URL. */
export default async function CaseStudiesPage() {
  const [studies, industries] = await Promise.all([getCaseStudies(), getCaseStudyIndustries()]);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Case Studies", href: "/case-studies" }]}
        title="Work we have delivered"
        description={description}
      />
      <section aria-label="Case study list" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {studies.length > 0 ? (
            // Fallback is the full, unfiltered list, so the static HTML contains every study.
            <Suspense fallback={<CaseStudyGrid studies={studies} />}>
              <CaseStudyBrowser studies={studies} industries={industries} />
            </Suspense>
          ) : (
            <p className="text-muted-foreground">
              Case studies are being prepared. Contact us for references relevant to your project.
            </p>
          )}
        </div>
      </section>
      <CtaBand
        title="Have a similar challenge?"
        description="Tell us what you need. We reply within one business day."
        primary={{ href: projectEnquiryHref(), label: "Start a similar project" }}
        secondary={{ href: contactHref, label: "Contact us" }}
      />
    </>
  );
}
