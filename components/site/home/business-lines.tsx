import Link from "next/link";
import { CodeIcon, UsersIcon, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/site/section";

type Line = {
  Icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  cta: { href: string; label: string };
};

const lines: Line[] = [
  {
    Icon: CodeIcon,
    title: "Project services",
    description: "We design, build and launch your product end to end, with one accountable team.",
    points: [
      "Custom web apps, SaaS and enterprise portals",
      "AI features built into real workflows",
      "Fixed bid per milestone, or time and materials",
    ],
    cta: { href: "/services", label: "Start a project" },
  },
  {
    Icon: UsersIcon,
    title: "Hire engineers",
    description: "Add vetted engineers to your team and keep your delivery on schedule.",
    points: [
      "Full-stack, AI/ML, QA, DevOps and UI/UX roles",
      "Dedicated engineers, full teams or contract-to-hire",
      "NDA and IP terms, with a replacement guarantee",
    ],
    cta: { href: "/hire-engineers", label: "Request engineers" },
  },
];

/** FR-P1: cards for the two service lines. */
export function BusinessLines() {
  return (
    <Section
      id="business-lines"
      eyebrow="Services"
      title="Need something built, or more hands?"
      description="The same engineers who build our products build for clients."
      className="bg-muted/40"
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {lines.map(({ Icon, title, description, points, cta }) => (
          <li
            key={title}
            className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
          >
            <Icon className="mb-4 size-8 text-muted-foreground" aria-hidden />
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-muted-foreground">{description}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/60"
                  />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "mt-8 self-start",
              })}
            >
              {cta.label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
