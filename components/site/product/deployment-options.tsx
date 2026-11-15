import { CloudIcon, PaletteIcon, ServerIcon, type LucideIcon } from "lucide-react";
import { Section } from "@/components/site/section";

type Known = { Icon: LucideIcon; title: string; description: string };

const known: Record<string, Known> = {
  saas: {
    Icon: CloudIcon,
    title: "SaaS",
    description: "We host, run and update it. You start quickly with no infrastructure to manage.",
  },
  "on-prem": {
    Icon: ServerIcon,
    title: "On-premise",
    description: "Runs in your data centre or private cloud. Your data never leaves your network.",
  },
  "white-label": {
    Icon: PaletteIcon,
    title: "White-label",
    description: "Your brand, your domain. Offer it to your own customers as your product.",
  },
};

/** Maps free-text values such as "On-premise" or "White label" to a known option. */
function match(option: string): Known | undefined {
  const key = option.toLowerCase().replace(/[\s_]+/g, "-");
  if (key.startsWith("on-prem")) return known["on-prem"];
  return known[key];
}

/** FR-P3 deployment options (SaaS / on-prem / white-label). */
export function DeploymentOptions({ options }: { options: string[] }) {
  if (options.length === 0) return null;

  return (
    <Section
      id="deployment"
      eyebrow="Deployment"
      title="Run it where it suits you"
      description="Choose the deployment model that fits your security and IT policies."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const info = match(option);
          const Icon = info?.Icon ?? ServerIcon;
          return (
            <li key={option} className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <Icon className="mb-4 size-6 text-muted-foreground" aria-hidden />
              <h3 className="font-semibold">{info?.title ?? option}</h3>
              {info && <p className="mt-2 text-sm text-muted-foreground">{info.description}</p>}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
