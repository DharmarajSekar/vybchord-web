import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { productEnquiryHref, type ProductInterest } from "@/lib/site/navigation";

const models: { title: string; description: string; interest: ProductInterest }[] = [
  {
    title: "SaaS subscription",
    description: "Pay per month or year. Hosting, updates and support included.",
    interest: "demo",
  },
  {
    title: "Enterprise licence",
    description: "Deploy on your infrastructure under a perpetual or term licence, with support.",
    interest: "licence",
  },
  {
    title: "White-label",
    description: "Licence the platform under your brand and sell it to your own customers.",
    interest: "licence",
  },
  {
    title: "IP transfer",
    description:
      "Take full ownership of the source code and IP, with a handover and transition plan.",
    interest: "ip_transfer",
  },
];

/** FR-P3 licensing and IP-transfer options. Same commercial models for every product (BRD §3). */
export function LicensingOptions({ slug, name }: { slug: string; name: string }) {
  return (
    <Section
      id="licensing"
      eyebrow="Licensing"
      title={`How you can own ${name}`}
      description="Pricing depends on users, modules and deployment. Tell us what you need and we will send a proposal."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {models.map((model) => (
          <li
            key={model.title}
            className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10"
          >
            <h3 className="font-semibold">{model.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{model.description}</p>
            <Link
              href={productEnquiryHref(slug, model.interest)}
              className={buttonVariants({
                variant: "outline",
                className: "mt-6 self-start",
              })}
            >
              Enquire
              <span className="sr-only"> about {model.title.toLowerCase()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
