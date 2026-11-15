// TEMPORARY e2e harness for F4/F6 until Prompt 8 places them. Deleted after testing.
import { ApplyForm } from "@/components/forms/apply-form";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export default function FormsTestPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-16 px-4 py-12">
      <section id="apply">
        <ApplyForm jobId="11111111-1111-4111-8111-111111111111" jobTitle="Full-stack engineer" />
      </section>
      <section id="newsletter">
        <NewsletterForm />
      </section>
    </div>
  );
}
