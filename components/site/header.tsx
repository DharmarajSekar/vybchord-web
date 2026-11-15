import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { bookDemoHref, contactHref } from "@/lib/site/navigation";
import { DesktopNav } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/** FR-G1: sticky header with main nav, "Book a demo" and "Contact". */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <Link
            href={contactHref}
            className={buttonVariants({ variant: "ghost", className: "hidden lg:inline-flex" })}
          >
            Contact
          </Link>
          <Link href={bookDemoHref} className={buttonVariants({ className: "h-9 px-3" })}>
            Book a demo
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
