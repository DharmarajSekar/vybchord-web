import type { ProductSummary } from "@/lib/data/products";
import type { SiteSettings } from "@/lib/data/site-settings";

type Fact = { label: string; value: string };

/** Facts only — every item is derived from the database, so nothing here can go stale. */
function buildFacts(products: ProductSummary[], settings: SiteSettings | null): Fact[] {
  const inMarket = products.filter((p) => p.status === "live" || p.status === "pilot").length;
  const domains = [...new Set(products.map((p) => p.domain).filter(Boolean))];

  const facts: Fact[] = [];
  if (inMarket > 0) {
    facts.push({
      value: String(inMarket),
      label: inMarket === 1 ? "Product live or in pilot" : "Products live or in pilot",
    });
  }
  if (domains.length > 0) facts.push({ value: domains.join(" · "), label: "Domains we build for" });
  facts.push({ value: "SaaS · Licence · IP transfer", label: "Commercial models" });
  if (settings?.cin) facts.push({ value: settings.cin, label: "Registered company (CIN)" });
  return facts;
}

/** FR-P1 proof strip. */
export function ProofStrip({
  products,
  settings,
}: {
  products: ProductSummary[];
  settings: SiteSettings | null;
}) {
  const facts = buildFacts(products, settings);

  return (
    <section aria-label="Company facts" className="border-y bg-muted/40">
      <dl className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {facts.map(({ label, value }) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-lg font-semibold tracking-tight break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
