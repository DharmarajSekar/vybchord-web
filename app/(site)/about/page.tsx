import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import { CompanyDetails } from "@/components/site/company-details";
import { CtaBand } from "@/components/site/cta-band";
import { InfoCards } from "@/components/site/info-cards";
import { OfficeMap } from "@/components/site/office-map";
import { PageHeader } from "@/components/site/page-header";
import { ProcessSteps } from "@/components/site/process-steps";
import { Section } from "@/components/site/section";
import { founder, mission, principles, story } from "@/content/about";
import { deliveryProcess } from "@/content/services";
import { getSiteSettings } from "@/lib/data/site-settings";
import { contactHref } from "@/lib/site/navigation";

export const revalidate = 3600;

const title = "About";
const description =
  "Vybchord builds AI-native, production-ready software: our own enterprise products, custom builds and engineering teams.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/about",
      type: "website",
    },
  };
}

const initials = founder.name
  .split(" ")
  .map((part) => part[0])
  .join("");

/** FR-P8 About: story, mission, founder, approach, legal entity details and office map. */
export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Company", href: "/about" }]}
        title="We build software that is ready for production"
        description={description}
      />

      <Section id="story" eyebrow="Our story" title="Products first, built to last">
        <div className="max-w-3xl space-y-4 text-lg text-muted-foreground">
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <section aria-labelledby="mission-title" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 id="mission-title" className="text-sm font-medium opacity-80">
            Our mission
          </h2>
          <p className="mt-3 max-w-4xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {mission}
          </p>
        </div>
      </section>

      <Section id="founder" eyebrow="Leadership" title="Founder">
        <article className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start">
          <div
            aria-hidden
            className="flex size-24 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-semibold"
          >
            {initials}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{founder.name}</h3>
            <p className="text-muted-foreground">{founder.role}</p>
            <div className="mt-4 space-y-3">
              {founder.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </Section>

      <Section id="approach" eyebrow="Our approach" title="How we work" className="bg-muted/40">
        <InfoCards cards={principles} columns={4} />
        <div className="mt-12">
          <h3 className="mb-6 text-lg font-semibold">Every engagement follows the same path</h3>
          <ProcessSteps
            steps={deliveryProcess.map((step) => ({
              title: step.name,
              description: step.description,
            }))}
          />
        </div>
      </Section>

      {settings && (
        <Section
          id="company"
          eyebrow="Company details"
          title="A registered company you can verify"
          description="For procurement and vendor onboarding."
        >
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <CompanyDetails settings={settings} />
            {settings.registered_office && <OfficeMap address={settings.registered_office} />}
          </div>
        </Section>
      )}

      <CtaBand
        title="Let's talk about what you need"
        description="Products, projects or engineers. We reply within one business day."
        primary={{ href: contactHref, label: "Contact us" }}
        secondary={{ href: "/products", label: "See our products" }}
      />
    </>
  );
}
