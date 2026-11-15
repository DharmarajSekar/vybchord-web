import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Service } from "@/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      <h3 className="text-lg font-semibold tracking-tight">
        <Link
          href={`/services/${service.slug}`}
          className="outline-none after:absolute after:inset-0 after:rounded-xl"
        >
          {service.title}
        </Link>
      </h3>
      <p className="mt-2 text-muted-foreground">{service.summary}</p>
      <p className="mt-4 text-sm text-muted-foreground">{service.timeline.total}</p>
      <p className="mt-auto flex items-center gap-1 pt-6 text-sm font-medium" aria-hidden>
        Learn more
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
