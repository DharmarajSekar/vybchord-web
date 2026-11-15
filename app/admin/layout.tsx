import type { Metadata } from "next";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminMobileNav, AdminSidebarNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "@/lib/admin/session";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { default: "Admin", template: "%s | Admin | Vybchord" },
    robots: { index: false, follow: false },
  };
}

/** FRD §5 admin panel shell. Every page below requires an admin session (see lib/admin/auth). */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4">
        <AdminMobileNav />
        <Link href="/admin" className="font-semibold tracking-tight">
          Vybchord <span className="font-normal text-muted-foreground">admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/"
            className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            View site
          </Link>
          <ThemeToggle />
          <span className="hidden max-w-48 truncate px-2 text-sm text-muted-foreground md:block">
            {admin.user.email}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
              <LogOutIcon aria-hidden />
            </Button>
          </form>
        </div>
      </header>
      <div className="flex flex-1">
        <AdminSidebarNav />
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
