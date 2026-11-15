// FR-P13 per-form thank-you pages: what happens next, matching each form's auto-reply promise.

export type ThankYou = {
  title: string;
  lead: string;
  steps: string[];
  /** Show the "Book a call" button when NEXT_PUBLIC_CAL_LINK is set. */
  booking: boolean;
  next: { href: string; label: string };
};

export const thankYouPages = {
  demo: {
    title: "Thanks — your demo request is in",
    lead: "We have emailed you a confirmation.",
    steps: [
      "We review your request and the product you chose.",
      "We reply within one business day to set up a walkthrough.",
      "The demo covers the modules and deployment options that matter to you.",
    ],
    booking: true,
    next: { href: "/products", label: "Explore our products" },
  },
  project: {
    title: "Thanks — your project brief is in",
    lead: "We have emailed you a confirmation.",
    steps: [
      "We read your brief and any attachment.",
      "We contact you within one business day to set up a discovery call.",
      "After discovery, you receive a scope, plan and estimate.",
    ],
    booking: true,
    next: { href: "/case-studies", label: "See our work" },
  },
  staffing: {
    title: "Thanks — we are matching engineers for you",
    lead: "We have emailed you a confirmation.",
    steps: [
      "We shortlist engineers who match your roles and skills.",
      "You receive matching profiles within 48 hours.",
      "You interview and choose who joins your team.",
    ],
    booking: true,
    next: { href: "/hire-engineers", label: "How hiring works" },
  },
  application: {
    title: "Thanks for applying",
    lead: "We have emailed you a confirmation.",
    steps: [
      "Our team reviews every application.",
      "If your profile matches the role, we contact you about next steps.",
      "We keep your CV for up to 12 months for similar roles, unless you ask us to delete it.",
    ],
    booking: false,
    next: { href: "/careers", label: "See other open roles" },
  },
  contact: {
    title: "Thanks for getting in touch",
    lead: "We have emailed you a confirmation.",
    steps: ["We read every message.", "We reply within one business day."],
    booking: true,
    next: { href: "/", label: "Back to home" },
  },
  newsletter: {
    title: "Check your inbox",
    lead: "We have sent you an email to confirm your subscription.",
    steps: [
      "Open the email from us.",
      "Click “Confirm subscription”.",
      "If you do not see it within a few minutes, check your spam folder.",
    ],
    booking: false,
    next: { href: "/insights", label: "Read our insights" },
  },
  "newsletter-confirmed": {
    title: "You are subscribed",
    lead: "Thanks for confirming. New insights will arrive in your inbox.",
    steps: ["You can unsubscribe at any time from any email we send."],
    booking: false,
    next: { href: "/insights", label: "Read our insights" },
  },
} satisfies Record<string, ThankYou>;

export type ThankYouKey = keyof typeof thankYouPages;
