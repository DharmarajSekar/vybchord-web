import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookiePolicy } from "@/components/legal/cookie-policy";
import { GrievancePage } from "@/components/legal/grievance-page";
import { LegalProse } from "@/components/legal/legal-prose";
import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import { TermsOfUse } from "@/components/legal/terms-of-use";
import { PageHeader } from "@/components/site/page-header";
import { legalDocs, type LegalDoc } from "@/content/legal";
import { getSiteSettings } from "@/lib/data/site-settings";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

function getDoc(doc: string) {
  return doc in legalDocs ? (doc as LegalDoc) : null;
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const doc = getDoc((await params).doc);
  if (!doc) return {};
  const { title, description } = legalDocs[doc];
  return { title, description, alternates: { canonical: `/legal/${doc}` } };
}

/** FR-P12 legal pages: Privacy, Terms, Cookies, Grievance Officer. */
export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const doc = getDoc((await params).doc);
  if (!doc) notFound();
  const settings = await getSiteSettings();
  const meta = legalDocs[doc];

  return (
    <>
      <PageHeader
        crumbs={[{ name: meta.title, href: `/legal/${doc}` }]}
        title={meta.title}
        description={`Last updated ${formatDate(meta.updated)}`}
      />
      <article
        aria-labelledby="page-title"
        className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <LegalProse>
          {doc === "privacy" && <PrivacyPolicy settings={settings} />}
          {doc === "terms" && <TermsOfUse settings={settings} />}
          {doc === "cookies" && <CookiePolicy />}
          {doc === "grievance" && <GrievancePage settings={settings} />}
        </LegalProse>
      </article>
    </>
  );
}
