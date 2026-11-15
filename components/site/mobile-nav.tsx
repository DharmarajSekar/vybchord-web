"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { bookDemoHref, contactHref, isActivePath, mainNav } from "@/lib/site/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}
      >
        <MenuIcon aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
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
