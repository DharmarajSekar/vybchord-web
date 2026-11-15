import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForms } from "@/components/forms/contact-forms";
import { ContactDetails } from "@/components/site/contact-details";
import { PageHeader } from "@/components/site/page-header";
import { getProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";

export const revalidate = 3600;

const title = "Contact";
const description =
  "Book a product demo, start a project or request engineers. We reply within one business day.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title, description, url: "/contact", type: "website" },
  };
}

/** FR-P11 contact page with topic routing. Static: the topic is read from the URL in the browser. */
export default async function ContactPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const productOptions = products.map((p) => ({ value: p.slug, label: p.name }));

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", href: "/contact" }]}
        title="Let's talk about what you need"
        description={description}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-8">
        <section aria-label="Enquiry form">
          <Suspense fallback={<div className="h-[600px] animate-pulse rounded-xl bg-muted/50" />}>
            <ContactForms products={productOptions} />
          </Suspense>
        </section>
        <ContactDetails settings={settings} />
      </div>
    </>
  );
}
