export type NavItem = { href: string; label: string };

/** FR-G1 primary navigation. */
export const mainNav: NavItem[] = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/hire-engineers", label: "Hire Engineers" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "Company" },
  { href: "/careers", label: "Careers" },
];

export const contactHref = "/contact";
/** "Book a demo" opens the contact form with the Product topic preselected (FR-P11). */
export const bookDemoHref = "/contact?topic=product";

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "What we do",
    items: [
      { href: "/products", label: "Products" },
      { href: "/services", label: "Project services" },
      { href: "/hire-engineers", label: "Hire engineers" },
      { href: "/case-studies", label: "Case studies" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/insights", label: "Insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

/** FR-P12 legal pages. */
export const legalNav: NavItem[] = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Use" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/grievance", label: "Grievance Officer" },
];

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type ProductInterest = "demo" | "licence" | "ip_transfer";

/** Contact form preselected for a product enquiry (F1 interest types). */
export function productEnquiryHref(slug: string, interest: ProductInterest): string {
  const params = new URLSearchParams({ topic: "product", product: slug, interest });
  return `/contact?${params.toString()}`;
}

/** Contact form preselected for a project enquiry (F2), optionally for one service. */
export function projectEnquiryHref(service?: string): string {
  const params = new URLSearchParams({ topic: "project" });
  if (service) params.set("service", service);
  return `/contact?${params.toString()}`;
}

/** Contact form preselected for a staffing request (F3), optionally for one role. */
export function staffingEnquiryHref(role?: string): string {
  const params = new URLSearchParams({ topic: "staffing" });
  if (role) params.set("role", role);
  return `/contact?${params.toString()}`;
}
