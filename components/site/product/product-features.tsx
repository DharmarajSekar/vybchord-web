import { CheckIcon, ShieldCheckIcon } from "lucide-react";
import { Section } from "@/components/site/section";
import type { ProductModule } from "@/lib/data/products";

/** FR-P3 problem statement. */
export function ProductProblem({ problem }: { problem: string | null }) {
  if (!problem?.trim()) return null;

  return (
    <Section id="problem" eyebrow="The problem" title="What it solves">
      <p className="max-w-3xl text-lg whitespace-pre-line text-muted-foreground">{problem}</p>
    </Section>
  );
}

/** FR-P3 modules / features grid. */
export function ModulesGrid({ modules }: { modules: ProductModule[] }) {
  if (modules.length === 0) return null;

  return (
    <Section
      id="modules"
      eyebrow="Modules"
      title="Everything in one platform"
      className="bg-muted/40"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <li key={module.title} className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <h3 className="flex items-center gap-2 font-semibold">
              <CheckIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              {module.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** FR-P3 security notes. */
export function SecurityNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;

  return (
    <Section
      id="security"
      eyebrow="Security"
      title="Built for enterprise security reviews"
      className="bg-muted/40"
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {notes.map((note) => (
          <li key={note} className="flex gap-3">
            <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
