import { FileCheckIcon, LayersIcon, ShieldCheckIcon, ZapIcon, type LucideIcon } from "lucide-react";
import { Section } from "@/components/site/section";

const items: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: ZapIcon,
    title: "AI-native delivery",
    description:
      "AI is part of how we design, code and test. You get working software in weeks, not quarters.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Production-ready from day one",
    description:
      "Security, access control, testing and monitoring are built in from the first release, not added later.",
  },
  {
    Icon: LayersIcon,
    title: "Buy it the way you need",
    description:
      "SaaS subscription, enterprise licence, white-label or full IP transfer. You choose how you own it.",
  },
  {
    Icon: FileCheckIcon,
    title: "Accountable vendor",
    description:
      "A registered private limited company. NDA-ready, with clear contracts and privacy-first data handling.",
  },
];

/** FR-P1 differentiators. */
export function Differentiators() {
  return (
    <Section
      id="differentiators"
      eyebrow="Why Vybchord"
      title="Built for teams that need to ship and stay compliant"
    >
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, description }) => (
          <li key={title}>
            <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
