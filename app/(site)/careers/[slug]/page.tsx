import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ApplyForm } from "@/components/forms/apply-form";
import { JsonLd } from "@/components/site/json-ld";
import { MdxContent } from "@/components/site/mdx-content";
import { PageHeader } from "@/components/site/page-header";
import { getJobBySlug, getJobSlugs } from "@/lib/data/jobs";
import { getSiteSettings } from "@/lib/data/site-settings";
import { formatDate, mdxToText } from "@/lib/format";
import { jobTypeLabel } from "@/lib/site/labels";
import { jobPostingJsonLd, ogSite } from "@/lib/seo";

// Closed or expired roles drop out on the next refresh and return 404 (Google Jobs guidance).
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const job = await getJobBySlug((await params).slug);
  if (!job) return { title: "Role not found", robots: { index: false } };

  const title = `${job.title}${job.location ? ` — ${job.location}` : ""}`;
  const description = mdxToText(job.description_mdx).slice(0, 160) || undefined;
  const url = `/careers/${job.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...ogSite,
      title,
      description,
      url,
    },
  };
}

/** FR-P9 job detail with JobPosting JSON-LD (NFR-3) and the F4 application form. */
export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const [job, settings] = await Promise.all([getJobBySlug((await params).slug), getSiteSettings()]);
  if (!job) notFound();

  const facts = [
    { label: "Location", value: job.location },
    { label: "Work mode", value: job.work_mode },
    { label: "Experience", value: job.experience },
    { label: "Posted", value: formatDate(job.posted_at) },
    { label: "Apply by", value: formatDate(job.valid_through) },
  ].filter((fact) => fact.value);

  return (
    <>
      <JsonLd data={jobPostingJsonLd(job, settings?.legal_name)} />
      <PageHeader
        crumbs={[
          { name: "Careers", href: "/careers" },
          { name: job.title, href: `/careers/${job.slug}` },
        ]}
        eyebrow={<Badge variant="secondary">{jobTypeLabel[job.type]}</Badge>}
        title={job.title}
      >
        <Link
          href="#apply"
          className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
        >
          Apply now
        </Link>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-8">
        <article aria-label="Role description" className="min-w-0">
          <MdxContent source={job.description_mdx} />
        </article>
        <aside aria-label="Role details" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <dl className="space-y-3 rounded-xl bg-muted/50 p-6 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="text-right font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {job.skills.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">Skills</h2>
              <ul className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="outline">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <section
        id="apply"
        aria-labelledby="apply-title"
        className="scroll-mt-16 border-t bg-muted/30"
      >
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 id="apply-title" className="text-3xl font-semibold tracking-tight">
            Apply for this role
          </h2>
          <p className="mt-2 mb-8 text-muted-foreground">
            It takes about two minutes. We review every application.
          </p>
          <ApplyForm jobId={job.id} jobTitle={job.title} />
        </div>
      </section>
    </>
  );
}
