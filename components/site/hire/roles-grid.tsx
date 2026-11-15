import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Role } from "@/content/hire-engineers";
import { staffingEnquiryHref } from "@/lib/site/navigation";

/** FR-P6 roles, each linking to a staffing request preselected for that role. */
export function RolesGrid({ roles }: { roles: Role[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {roles.map((role) => (
        <li
          key={role.slug}
          className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10"
        >
          <h3 className="font-semibold">{role.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
          <Link
            href={staffingEnquiryHref(role.slug)}
            className="mt-auto inline-flex items-center gap-1 self-start rounded-sm pt-4 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Request
            <span className="sr-only"> a {role.title.toLowerCase()}</span>
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
