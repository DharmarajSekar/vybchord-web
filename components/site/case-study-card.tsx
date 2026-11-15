import Link from "next/link";
import type { CaseStudySummary } from "@/lib/data/case-studies";

/** Case study teaser. Shows "Confidential client" when the study is anonymised. */
export function CaseStudyCard({ study }: { study: CaseStudySummary }) {
  const client = study.anonymised ? "Confidential client" : study.client_name;

  return (
    <article className="relative flex h-full flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      <p className="text-sm text-muted-foreground">
        {[client, study.industry].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">
        <Link
          href={`/case-studies/${study.slug}`}
          className="outline-none after:absolute after:inset-0 after:rounded-xl"
        >
          {study.title}
        </Link>
      </h3>
      {study.outcome && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{study.outcome}</p>
      )}
    </article>
  );
}
