import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import Link from "next/link";
import { FileLockIcon, RefreshCwIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { RolesGrid } from "@/components/site/hire/roles-grid";
import { SkillsMatrix } from "@/components/site/hire/skills-matrix";
import { CheckList, InfoCards } from "@/components/site/info-cards";
import { PageHeader } from "@/components/site/page-header";
import { ProcessSteps } from "@/components/site/process-steps";
import { Section } from "@/components/site/section";
import {
  ndaIpTerms,
  onboardingSteps,
  replacementGuarantee,
  roles,
  staffingModels,
  workModes,
} from "@/content/hire-engineers";
import { contactHref, staffingEnquiryHref } from "@/lib/site/navigation";

const title = "Hire engineers";
const description =
  "Add vetted engineers to your team: full-stack, frontend, backend, AI/ML, QA, DevOps and UI/UX. Matching profiles within 48 hours, NDA and IP terms from day one.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/hire-engineers" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/hire-engineers",
      type: "website",
    },
  };
}

/** FR-P6 staff augmentation. Content is static (content/hire-engineers.ts). */
export default function HireEngineersPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Hire Engineers", href: "/hire-engineers" }]}
        title="Engineers who join your team and deliver"
        description={description}
      >
        <Link
          href={staffingEnquiryHref()}
          className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
        >
          Request engineers
        </Link>
      </PageHeader>

      <Section id="roles" eyebrow="Roles" title="Who you can hire">
        <RolesGrid roles={roles} />
      </Section>

      <Section id="skills" eyebrow="Skills matrix" title="Skills by role" className="bg-muted/40">
        <SkillsMatrix roles={roles} />
      </Section>

      <Section id="models" eyebrow="Engagement models" title="Hire the way that suits you">
        <InfoCards cards={staffingModels} />
      </Section>

      <Section
        id="onboarding"
        eyebrow="Onboarding"
        title="From request to first commit"
        className="bg-muted/40"
      >
        <ProcessSteps steps={onboardingSteps} />
      </Section>

      <Section id="work-modes" eyebrow="Work modes" title="Remote, onsite or hybrid">
        <InfoCards cards={workModes} />
      </Section>

      <Section
        id="assurance"
        eyebrow="Assurance"
        title="Your IP is protected, and delivery keeps moving"
        className="bg-muted/40"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FileLockIcon className="size-5 text-muted-foreground" aria-hidden />
              NDA and IP terms
            </h3>
            <CheckList items={ndaIpTerms} />
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <RefreshCwIcon className="size-5 text-muted-foreground" aria-hidden />
              Replacement guarantee
            </h3>
            <CheckList items={replacementGuarantee} />
          </div>
        </div>
      </Section>

      <CtaBand
        title="Tell us who you need"
        description="Share roles, headcount and start date. You get matching profiles within 48 hours."
        primary={{ href: staffingEnquiryHref(), label: "Request engineers" }}
        secondary={{ href: contactHref, label: "Contact us" }}
      />
    </>
  );
}
