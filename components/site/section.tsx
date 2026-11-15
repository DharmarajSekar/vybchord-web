import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

/** Page section with a consistent heading block; the title labels the region. */
export function Section({ id, eyebrow, title, description, className, children }: SectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          {eyebrow && <p className="mb-2 text-sm font-medium text-muted-foreground">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight text-balance">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-lg text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
