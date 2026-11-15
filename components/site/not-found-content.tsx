import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { contactHref } from "@/lib/site/navigation";

const suggestions = [
  { href: "/products", label: "Products", description: "Platforms you can deploy now" },
  { href: "/services", label: "Project services", description: "Software built for you" },
  { href: "/hire-engineers", label: "Hire engineers", description: "Add engineers to your team" },
  { href: "/case-studies", label: "Case studies", description: "Work we have delivered" },
  { href: "/careers", label: "Careers", description: "Open roles" },
  { href: "/insights", label: "Insights", description: "Articles and notes" },
];

/** FR-P13 helpful 404: explains, then offers the main destinations. */
export function NotFoundContent() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 id="not-found-title" className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        We could not find that page
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        The link may be out of date, or the page may have moved. These are good places to start.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-xl p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="flex items-center gap-1 font-semibold">
                {item.label}
                <ArrowRightIcon
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}>
          Go to the home page
        </Link>
        <Link
          href={contactHref}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "h-11 px-5 text-base",
          })}
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
