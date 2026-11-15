import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./breadcrumbs";

type PageHeaderProps = {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  /** CTA buttons under the description. */
  children?: ReactNode;
};

/** Top of an inner page: breadcrumbs, the page's single h1, lead text and optional CTAs. */
export function PageHeader({ crumbs, eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section aria-labelledby="page-title" className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs crumbs={crumbs} />
        {eyebrow && <div className="mt-8 flex flex-wrap items-center gap-3">{eyebrow}</div>}
        <h1
          id="page-title"
          className={`${eyebrow ? "mt-3" : "mt-8"} max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl`}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-lg text-pretty text-muted-foreground sm:text-xl">
            {description}
          </p>
        )}
        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
      </div>
    </section>
  );
}
