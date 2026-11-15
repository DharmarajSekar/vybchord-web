import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { InfoCards } from "@/components/site/info-cards";
import { PageHeader } from "@/components/site/page-header";
import { ProcessSteps } from "@/components/site/process-steps";
import { Section } from "@/components/site/section";
import { ServiceCard } from "@/components/site/services/service-card";
import { deliveryProcess, projectEngagementModels, services } from "@/content/services";
import { contactHref, projectEnquiryHref } from "@/lib/site/navigation";

const title = "Project services";
const description =
  "We design, build and launch software end to end: custom products, AI features, SaaS, modernisation and UI/UX. One accountable team, production-ready from the first release.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/services" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/services",
      type: "website",
    },
  };
}

/** FR-P4 services overview. Content is static (content/services.ts), so the page is fully SSG. */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Services", href: "/services" }]}
        title="Software built for you, ready for production"
        description={description}
      >
        <Link
          href={projectEnquiryHref()}
          className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
        >
          Start a project
        </Link>
      </PageHeader>

      <Section id="service-lines" eyebrow="What we build" title="Service lines">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="process"
        eyebrow="How we work"
        title="Discover, design, build, launch, support"
        description="A working demo every two weeks, so you always know where the project stands."
        className="bg-muted/40"
      >
        <ProcessSteps
          steps={deliveryProcess.map((step) => ({
            title: step.name,
            description: step.description,
          }))}
        />
      </Section>

      <Section
        id="engagement"
        eyebrow="Engagement models"
        title="Pick the model that fits your project"
      >
        <InfoCards cards={projectEngagementModels} />
      </Section>

      <CtaBand
        title="Tell us what you want to build"
        description="Share a short brief. We reply within one business day to set up a discovery call."
        primary={{ href: projectEnquiryHref(), label: "Start a project" }}
        secondary={{ href: contactHref, label: "Contact us" }}
      />
    </>
  );
}
