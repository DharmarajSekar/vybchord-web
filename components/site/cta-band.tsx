import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Action = { href: string; label: string };

type CtaBandProps = {
  title: string;
  description: string;
  primary: Action;
  secondary?: Action;
};

/** Closing call to action used at the end of marketing pages. */
export function CtaBand({ title, description, primary, secondary }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-linear-to-br from-brand-violet to-brand-blue px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-3xl font-semibold tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-3 text-lg text-pretty opacity-80">{description}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "h-11 px-5 text-base",
            })}
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className:
                  "h-11 px-5 text-base text-primary-foreground ring-1 ring-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
