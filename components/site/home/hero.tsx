import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { bookDemoHref } from "@/lib/site/navigation";

/** FR-P1 hero. Text-only so it is the LCP element and renders without layout shift. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--brand-blue)_12%,transparent),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--brand-violet)_28%,transparent),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Products · Project services · Engineering teams
        </p>
        <h1
          id="hero-title"
          className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          AI-native software,{" "}
          <span className="text-brand-gradient">production-ready from day one.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">
          We build enterprise platforms for HR, legal and real estate teams. License our products,
          have us build yours, or add our engineers to your team.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={bookDemoHref}
            className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
          >
            Book a demo
          </Link>
          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-11 px-5 text-base",
            })}
          >
            See our products
            <ArrowRightIcon aria-hidden data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </section>
  );
}
