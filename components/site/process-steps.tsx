type Step = { title: string; description?: string; when?: string };

/** Numbered process or timeline. Horizontal on wide screens, vertical on mobile. */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 md:flex-col">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            {index + 1}
          </span>
          <div>
            {step.when && (
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {step.when}
              </p>
            )}
            <h3 className="font-semibold">{step.title}</h3>
            {step.description && (
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
