"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  FileTextIcon,
  HistoryIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MenuIcon,
  NewspaperIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboardIcon },
  { href: "/admin/leads", label: "Leads", Icon: InboxIcon },
  { href: "/admin/products", label: "Products", Icon: PackageIcon },
  { href: "/admin/case-studies", label: "Case studies", Icon: FileTextIcon },
  { href: "/admin/insights", label: "Insights", Icon: NewspaperIcon },
  { href: "/admin/jobs", label: "Jobs & applications", Icon: BriefcaseIcon },
  { href: "/admin/bench", label: "Talent bench", Icon: UsersIcon },
  { href: "/admin/settings", label: "Settings", Icon: SettingsIcon },
  { href: "/admin/audit", label: "Audit log", Icon: HistoryIcon },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {items.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                active && "bg-muted text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminSidebarNav() {
  return (
    <nav aria-label="Admin" className="hidden w-60 shrink-0 border-r p-4 lg:block">
      <NavLinks />
    </nav>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu" />
        }
      >
        <MenuIcon aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Admin</SheetTitle>
        </SheetHeader>
        <nav aria-label="Admin" className="px-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
