import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProductSummary } from "@/lib/data/products";
import type { Enums } from "@/lib/supabase/types";

export const productStatusLabel: Record<Enums<"product_status">, string> = {
  live: "Live",
  pilot: "Pilot",
  coming_soon: "Coming soon",
};

/** FR-P2 card: name, domain, one-liner, status. The whole card is one link. */
export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        {product.domain && <p className="text-sm text-muted-foreground">{product.domain}</p>}
        <Badge variant={product.status === "live" ? "default" : "secondary"}>
          {productStatusLabel[product.status]}
        </Badge>
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        <Link
          href={`/products/${product.slug}`}
          className="outline-none after:absolute after:inset-0 after:rounded-xl"
        >
          {product.name}
        </Link>
      </h3>
      {product.tagline && <p className="mt-2 font-medium">{product.tagline}</p>}
      {product.summary && <p className="mt-2 text-muted-foreground">{product.summary}</p>}
      <p className="mt-auto flex items-center gap-1 pt-6 text-sm font-medium" aria-hidden>
        View product
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
