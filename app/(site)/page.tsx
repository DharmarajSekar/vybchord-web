import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cta-band";
import { BusinessLines } from "@/components/site/home/business-lines";
import { Differentiators } from "@/components/site/home/differentiators";
import { Hero } from "@/components/site/home/hero";
import { ProductShowcase } from "@/components/site/home/product-showcase";
import { ProofStrip } from "@/components/site/home/proof-strip";
import { getProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/site-settings";
import { bookDemoHref, contactHref } from "@/lib/site/navigation";

export const revalidate = 3600;

const title = "AI-native software, production-ready from day one";
const description =
  "Enterprise platforms for HR, legal and real estate teams. License our products, have us build yours, or add our engineers to your team.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `Vybchord — ${title}` },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", type: "website" },
  };
}

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <>
      <Hero />
      <ProductShowcase products={products} />
      <BusinessLines />
      <Differentiators />
      <ProofStrip products={products} settings={settings} />
      <CtaBand
        title="Tell us what you need to ship"
        description="Book a product demo, or share your project or hiring needs. We reply within one business day."
        primary={{ href: bookDemoHref, label: "Book a demo" }}
        secondary={{ href: contactHref, label: "Contact us" }}
      />
    </>
  );
}
