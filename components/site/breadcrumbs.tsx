import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./json-ld";

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD (NFR-2). The last crumb is the current page. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className="rounded-sm hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {crumb.name}
                    </Link>
                    <ChevronRightIcon className="size-3.5" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
