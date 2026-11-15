"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { bookDemoHref, contactHref, isActivePath, mainNav } from "@/lib/site/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The menu button: focus returns to it when the sheet closes. */
  returnFocus: RefObject<HTMLButtonElement | null>;
};

/** FR-G1 mobile menu, loaded on first open by MobileNav. */
export function MobileNavSheet({ open, onOpenChange, returnFocus }: Props) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-xs" finalFocus={returnFocus}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="flex flex-col">
            {mainNav.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-3 text-base font-medium focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <Link href={bookDemoHref} onClick={close} className={buttonVariants({ size: "lg" })}>
            Book a demo
          </Link>
          <Link
            href={contactHref}
            onClick={close}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Contact
          </Link>
          <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
            Theme
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
