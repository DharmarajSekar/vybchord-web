// Service line content (FR-P4, FR-P5). Edit here; pages pick changes up on the next build.

export type ServicePhase = { name: string; duration: string };

export type Service = {
  slug: string;
  title: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Opening paragraph on the detail page. */
  intro: string;
  scope: string[];
  deliverables: string[];
  timeline: { total: string; phases: ServicePhase[] };
  stack: string[];
};

export const services: Service[] = [
  {
    slug: "custom-product-development",
    title: "Custom product development",
    summary: "From idea or spec to a production product your users can rely on.",
    intro:
      "We take your product from first workshop to live release with one accountable team. You get working software early, then every two weeks after that.",
    scope: [
      "Product discovery and requirements",
      "Web and mobile-responsive applications",
      "Back-end APIs, integrations and data models",
      "Role-based access, audit trails and admin tools",
      "Cloud setup, CI/CD and monitoring",
    ],
    deliverables: [
      "Production application, deployed to your cloud",
      "Full source code in your repository",
      "Architecture and API documentation",
      "Automated tests and a CI/CD pipeline",
      "Handover session and runbook",
    ],
    timeline: {
      total: "8–16 weeks to first release",
      phases: [
        { name: "Discover", duration: "1–2 weeks" },
        { name: "Design", duration: "2–3 weeks" },
        { name: "Build", duration: "4–10 weeks" },
        { name: "Launch", duration: "1 week" },
      ],
    },
    stack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "AWS"],
  },
  {
    slug: "ai-integration",
    title: "AI integration",
    summary: "Put AI into real workflows: extraction, assistants, search and automation.",
    intro:
      "We add AI where it removes manual work and keep humans in control where it matters. Every feature ships with evaluation, guardrails and cost controls.",
    scope: [
      "Use-case discovery and ROI sizing",
      "Document extraction and classification",
      "Assistants and search over your own data",
      "Workflow automation with human review",
      "Evaluation, monitoring and cost controls",
    ],
    deliverables: [
      "AI features integrated into your product or tools",
      "Evaluation set and quality report",
      "Prompt, model and data pipeline documentation",
      "Usage and cost dashboard",
      "Guardrails and fallback behaviour",
    ],
    timeline: {
      total: "4–10 weeks to production",
      phases: [
        { name: "Discover", duration: "1 week" },
        { name: "Prototype", duration: "1–2 weeks" },
        { name: "Build", duration: "2–6 weeks" },
        { name: "Launch", duration: "1 week" },
      ],
    },
    stack: ["Python", "TypeScript", "LLM APIs", "pgvector", "PostgreSQL", "Next.js"],
  },
  {
    slug: "saas-development",
    title: "SaaS builds",
    summary: "Multi-tenant SaaS with billing, roles and admin, ready to sell.",
    intro:
      "We build SaaS products that are ready for paying customers from day one: tenant isolation, subscriptions, onboarding and the admin tools your team needs.",
    scope: [
      "Multi-tenant architecture and data isolation",
      "Sign-up, onboarding and team management",
      "Subscriptions, plans and billing",
      "Customer admin and internal back office",
      "Usage analytics and audit logs",
    ],
    deliverables: [
      "Production SaaS application",
      "Billing and plan management",
      "Admin console",
      "Source code, infrastructure-as-code and docs",
      "Launch checklist and handover",
    ],
    timeline: {
      total: "10–20 weeks to launch",
      phases: [
        { name: "Discover", duration: "1–2 weeks" },
        { name: "Design", duration: "2–3 weeks" },
        { name: "Build", duration: "6–14 weeks" },
        { name: "Launch", duration: "1 week" },
      ],
    },
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Stripe", "AWS"],
  },
  {
    slug: "modernisation",
    title: "Application modernisation",
    summary: "Move legacy systems to a modern stack without stopping the business.",
    intro:
      "We modernise in stages, so your users keep working while old modules are replaced. Each stage is tested against the existing system before it goes live.",
    scope: [
      "Assessment of the current system and risks",
      "Target architecture and migration plan",
      "Incremental rewrite or re-platforming",
      "Data migration and reconciliation",
      "Performance and security hardening",
    ],
    deliverables: [
      "Modernisation roadmap with milestones",
      "Migrated modules running in production",
      "Data migration scripts and validation reports",
      "Updated documentation and runbooks",
      "Decommissioning plan for legacy parts",
    ],
    timeline: {
      total: "Phased, from 6 weeks per stage",
      phases: [
        { name: "Assess", duration: "2–3 weeks" },
        { name: "Plan", duration: "1–2 weeks" },
        { name: "Migrate", duration: "4+ weeks per stage" },
        { name: "Cut over", duration: "1 week per stage" },
      ],
    },
    stack: ["TypeScript", "Node.js", "Java", ".NET", "PostgreSQL", "Docker", "AWS"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX design",
    summary: "Research-led product design and design systems your developers can build.",
    intro:
      "We design products people can use without training. Designs are built as reusable components, so they move into code quickly and stay consistent.",
    scope: [
      "User research and journey mapping",
      "Information architecture and wireframes",
      "High-fidelity UI and interactive prototypes",
      "Design systems and component libraries",
      "Accessibility review (WCAG 2.1 AA)",
    ],
    deliverables: [
      "Clickable prototype",
      "Design system with documented components",
      "Developer-ready specs and assets",
      "Usability test findings",
      "Accessibility checklist",
    ],
    timeline: {
      total: "3–8 weeks",
      phases: [
        { name: "Research", duration: "1–2 weeks" },
        { name: "Wireframes", duration: "1–2 weeks" },
        { name: "UI and prototype", duration: "1–3 weeks" },
        { name: "Handover", duration: "1 week" },
      ],
    },
    stack: ["Figma", "Design tokens", "Tailwind CSS", "shadcn/ui", "React"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** FR-P4 delivery process. */
export const deliveryProcess = [
  {
    name: "Discover",
    description: "We map goals, users and constraints, and agree scope and success measures.",
  },
  {
    name: "Design",
    description: "Architecture, UX and a clickable prototype you can test before we build.",
  },
  {
    name: "Build",
    description: "Two-week sprints with a working demo at the end of each one.",
  },
  {
    name: "Launch",
    description: "Security checks, load tests and a planned go-live with rollback ready.",
  },
  {
    name: "Support",
    description: "Monitoring, fixes and improvements under a support plan that fits you.",
  },
];

/** FR-P4 engagement models for projects (BRD §3). */
export const projectEngagementModels = [
  {
    title: "Fixed bid per milestone",
    description:
      "Agreed scope, price and dates for each milestone. Best when requirements are clear.",
  },
  {
    title: "Time and materials",
    description:
      "Pay for the time used, with weekly reports. Best when scope will evolve as you learn.",
  },
  {
    title: "Dedicated team",
    description:
      "A team that works only on your product, month to month. Best for ongoing roadmaps.",
  },
];
