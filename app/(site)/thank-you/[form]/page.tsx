import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { thankYouPages, type ThankYouKey } from "@/content/thank-you";
import { bookingUrl } from "@/lib/site/booking";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(thankYouPages).map((form) => ({ form }));
}

function getPage(form: string) {
  return form in thankYouPages ? thankYouPages[form as ThankYouKey] : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/thank-you/[form]">): Promise<Metadata> {
  const page = getPage((await params).form);
  return { title: page?.title ?? "Thank you", robots: { index: false, follow: false } };
}

/** FR-P13 per-form thank-you page with next steps and a booking link. */
export default async function ThankYouPage({ params }: PageProps<"/thank-you/[form]">) {
  const page = getPage((await params).form);
  if (!page) notFound();
  const booking = page.booking ? bookingUrl() : null;

  return (
    <section
      aria-labelledby="page-title"
      className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <CheckCircle2Icon className="size-12 text-muted-foreground" aria-hidden />
      <h1
        id="page-title"
        className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {page.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{page.lead}</p>

      <h2 className="mt-10 font-semibold">What happens next</h2>
      <ol className="mt-4 space-y-3">
        {page.steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {booking && (
          <a
            href={booking}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}
          >
            <CalendarIcon aria-hidden />
            Book a call now
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <Link
          href={page.next.href}
          className={buttonVariants({
            variant: booking ? "outline" : "default",
            size: "lg",
            className: "h-11 px-5 text-base",
          })}
        >
          {page.next.label}
        </Link>
      </div>
    </section>
  );
}
