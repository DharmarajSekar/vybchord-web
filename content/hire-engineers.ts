// Staff augmentation content (FR-P6). Edit here; the page picks changes up on the next build.

export type Role = {
  slug: string;
  title: string;
  description: string;
  core: string[];
  tools: string[];
};

export const roles: Role[] = [
  {
    slug: "full-stack",
    title: "Full-stack engineer",
    description: "Ships features end to end, from database to UI.",
    core: ["TypeScript", "React", "Next.js", "Node.js"],
    tools: ["PostgreSQL", "REST/GraphQL", "Docker"],
  },
  {
    slug: "frontend",
    title: "Frontend engineer",
    description: "Builds fast, accessible interfaces that match the design.",
    core: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    tools: ["Testing Library", "Playwright", "Figma"],
  },
  {
    slug: "backend",
    title: "Backend engineer",
    description: "Designs APIs, data models and integrations that scale.",
    core: ["Node.js", "Python", "Java", "PostgreSQL"],
    tools: ["Redis", "Kafka", "REST/GraphQL"],
  },
  {
    slug: "ai-ml",
    title: "AI/ML engineer",
    description: "Builds AI features that are measured, monitored and cost-controlled.",
    core: ["Python", "LLM APIs", "RAG", "Evaluation"],
    tools: ["pgvector", "PyTorch", "FastAPI"],
  },
  {
    slug: "qa",
    title: "QA engineer",
    description: "Automates testing so releases go out with confidence.",
    core: ["Test automation", "Playwright", "API testing"],
    tools: ["Postman", "k6", "CI pipelines"],
  },
  {
    slug: "devops",
    title: "DevOps engineer",
    description: "Runs reliable infrastructure, pipelines and monitoring.",
    core: ["AWS", "Docker", "Kubernetes", "Terraform"],
    tools: ["GitHub Actions", "Prometheus", "Grafana"],
  },
  {
    slug: "ui-ux",
    title: "UI/UX designer",
    description: "Turns requirements into clear, usable product design.",
    core: ["Figma", "User research", "Design systems"],
    tools: ["Prototyping", "Usability testing", "WCAG"],
  },
];

/** FR-P6 engagement models (BRD §3: monthly rate, dedicated team, contract-to-hire). */
export const staffingModels = [
  {
    title: "Dedicated engineer",
    description:
      "One engineer, full time on your team, at a fixed monthly rate. Scale up or down month to month.",
  },
  {
    title: "Team",
    description:
      "A small team with a lead, sized to your roadmap. One point of contact for delivery.",
  },
  {
    title: "Contract-to-hire",
    description:
      "Start on contract, then hire the engineer onto your payroll once you are sure of the fit.",
  },
];

/** FR-P6 onboarding timeline. The 48-hour step matches the F3 auto-reply promise. */
export const onboardingSteps = [
  {
    when: "Day 0",
    title: "Share your requirement",
    description: "Roles, skills, headcount and start date.",
  },
  {
    when: "Within 48 hours",
    title: "Matching profiles",
    description: "Shortlisted engineers with skills summaries.",
  },
  {
    when: "Week 1",
    title: "You interview",
    description: "Meet the engineers and pick who joins your team.",
  },
  {
    when: "Week 1–2",
    title: "Onboarding",
    description: "NDA signed, access set up, kick-off with your lead.",
  },
  {
    when: "Ongoing",
    title: "Monthly reviews",
    description: "Check-ins on delivery, fit and team changes.",
  },
];

export const workModes = [
  { title: "Remote", description: "Works from our office or home, in your time zone overlap." },
  { title: "Onsite", description: "Works from your office for the length of the engagement." },
  { title: "Hybrid", description: "A mix of onsite days and remote work, agreed with you." },
];

export const ndaIpTerms = [
  "NDA signed before you share any project details",
  "All work product and IP assigned to you",
  "Engineers follow your security, access and device policies",
  "Confidentiality continues after the engagement ends",
];

export const replacementGuarantee = [
  "If an engineer is not the right fit, we replace them at no extra cost",
  "We manage the handover so your work does not stop",
  "Planned leave is covered with backup arranged in advance",
];
