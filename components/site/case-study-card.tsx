import Image from "next/image";
import Link from "next/link";
import type { CaseStudySummary } from "@/lib/data/case-studies";
import { mediaUrl } from "@/lib/media";

/** Case study teaser. Shows "Confidential client" when the study is anonymised. */
export function CaseStudyCard({ study }: { study: CaseStudySummary }) {
  const client = study.anonymised ? "Confidential client" : study.client_name;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      {study.image && (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={mediaUrl(study.image)}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
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
      </div>
    </article>
  );
}
