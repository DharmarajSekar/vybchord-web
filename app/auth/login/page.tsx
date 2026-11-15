import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { safeAdminPath } from "@/lib/admin/allow-list";
import { getAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Admin sign in", robots: { index: false, follow: false } };
}

const errors: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Request a new one.",
  denied: "This email is not allowed to access the admin panel.",
  setup: "Sign-in worked, but the admin account could not be set up. Check the server logs.",
};

/** Admin login (magic link). Outside /admin so the protected layout never redirects it. */
export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  if (await getAdmin()) redirect(safeAdminPath(next));
  const error = typeof params.error === "string" ? errors[params.error] : undefined;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-sm ring-1 ring-foreground/10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Vybchord
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          We will email you a one-time sign-in link.
        </p>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
