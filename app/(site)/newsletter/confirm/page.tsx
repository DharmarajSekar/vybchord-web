import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { confirmNewsletter } from "@/lib/actions/newsletter";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Confirm subscription", robots: { index: false, follow: false } };
}

/**
 * F6 double opt-in, step 2. The emailed link lands here; confirming needs a click (POST),
 * so link scanners that open emails cannot subscribe anyone.
 */
export default async function ConfirmNewsletterPage({
  searchParams,
}: PageProps<"/newsletter/confirm">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const status = typeof params.status === "string" ? params.status : null;
  const invalid = status === "invalid" || (!token && !status);

  return (
    <section
      aria-labelledby="page-title"
      className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <h1 id="page-title" className="text-3xl font-semibold tracking-tight">
        {invalid ? "This link is not valid" : "Confirm your subscription"}
      </h1>

      {invalid ? (
        <>
          <p className="mt-3 text-muted-foreground">
            The link may have expired or already been used. You can sign up again from our insights
            page.
          </p>
          <Link href="/insights" className={buttonVariants({ size: "lg", className: "mt-8" })}>
            Go to insights
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 text-muted-foreground">
            {status === "error"
              ? "Something went wrong. Please try again."
              : "Click below to start receiving our insights by email."}
          </p>
          <form action={confirmNewsletter} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <Button type="submit" size="lg" className="h-11 px-5 text-base">
              Confirm subscription
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
