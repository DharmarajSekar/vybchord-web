import { NewsletterForm } from "@/components/forms/newsletter-form";

/** FR-P10 "Subscribe" CTA with the F6 double opt-in form. */
export function SubscribeSection() {
  return (
    <section aria-labelledby="subscribe-title" className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 lg:px-8">
        <div>
          <h2 id="subscribe-title" className="text-2xl font-semibold tracking-tight">
            Get new insights by email
          </h2>
          <p className="mt-2 text-muted-foreground">
            Practical notes on building AI-native, production-ready software. No spam; unsubscribe
            any time.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
