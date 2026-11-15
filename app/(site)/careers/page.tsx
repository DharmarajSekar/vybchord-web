import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { JobBrowser } from "@/components/site/careers/job-browser";
import { JobList } from "@/components/site/careers/job-card";
import { InfoCards } from "@/components/site/info-cards";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { culture, workingModel } from "@/content/careers";
import { getJobs } from "@/lib/data/jobs";

export const revalidate = 3600;

const title = "Careers";
const description =
  "Build AI-native software that goes to production. Full-time roles, contracts and client deployments.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/careers" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/careers",
      type: "website",
    },
  };
}

/** FR-P9 careers: culture, working model and open roles with filters. */
export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Careers", href: "/careers" }]}
        title="Build software that ships"
        description={description}
      >
        <Link
          href="#roles"
          className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
        >
          See open roles
        </Link>
      </PageHeader>

      <Section id="culture" eyebrow="Culture" title="How we work">
        <InfoCards cards={culture} columns={4} />
      </Section>

      <Section
        id="working-model"
        eyebrow="Working model"
        title="Ways to join us"
        className="bg-muted/40"
      >
        <InfoCards cards={workingModel} />
      </Section>

      <div id="roles" className="scroll-mt-16">
        <Section id="open-roles" eyebrow="Open roles" title="Find your next role">
          {jobs.length > 0 ? (
            <Suspense fallback={<JobList jobs={jobs} />}>
              <JobBrowser jobs={jobs} />
            </Suspense>
          ) : (
            <div className="rounded-xl bg-muted/50 p-6 sm:p-8">
              <p className="font-medium">There are no open roles right now.</p>
              <p className="mt-1 text-muted-foreground">
                We are always glad to hear from strong engineers and designers.
              </p>
              <Link
                href="/contact?topic=careers"
                className={buttonVariants({ variant: "outline", className: "mt-4" })}
              >
                Get in touch
              </Link>
            </div>
          )}
        </Section>
      </div>
    </>
  );
}
