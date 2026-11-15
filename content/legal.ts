// FR-P12 legal documents. Update `updated` whenever a document's text changes.

export const legalDocs = {
  privacy: {
    title: "Privacy Policy",
    description:
      "How we collect, use, keep and protect personal data, and your rights under India's Digital Personal Data Protection Act, 2023.",
    updated: "2026-11-15",
  },
  terms: {
    title: "Terms of Use",
    description: "The terms that apply when you use this website.",
    updated: "2026-11-15",
  },
  cookies: {
    title: "Cookie Policy",
    description: "The cookies and similar technologies this website uses, and how to control them.",
    updated: "2026-11-15",
  },
  grievance: {
    title: "Grievance Officer",
    description: "How to raise a privacy request or complaint, and who handles it.",
    updated: "2026-11-15",
  },
} as const;

export type LegalDoc = keyof typeof legalDocs;
