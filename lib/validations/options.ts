// Choice lists shared by form UIs, zod schemas, emails and the admin inbox.
import { roles } from "@/content/hire-engineers";
import { services } from "@/content/services";

export type Option = { value: string; label: string };

export const interestTypes = [
  { value: "demo", label: "Product demo" },
  { value: "licence", label: "Licensing" },
  { value: "ip_transfer", label: "IP transfer" },
] as const satisfies Option[];

export const companySizes = [
  { value: "1-50", label: "1–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
] as const satisfies Option[];

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "3-6-months", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const satisfies Option[];

export const projectTypes: Option[] = [
  ...services.map((service) => ({ value: service.slug, label: service.title })),
  { value: "other", label: "Something else" },
];

export const budgetRanges = [
  { value: "under-10l", label: "Under ₹10 lakh" },
  { value: "10-25l", label: "₹10–25 lakh" },
  { value: "25-50l", label: "₹25–50 lakh" },
  { value: "50l-plus", label: "₹50 lakh+" },
  { value: "not-sure", label: "Not sure yet" },
] as const satisfies Option[];

export const roleOptions: Option[] = roles.map((role) => ({ value: role.slug, label: role.title }));

export const engagementModels = [
  { value: "dedicated", label: "Dedicated engineer" },
  { value: "team", label: "Team" },
  { value: "contract-to-hire", label: "Contract-to-hire" },
] as const satisfies Option[];

export const workModeOptions = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
] as const satisfies Option[];

/** FR-P11 contact topics. */
export const contactTopics = [
  { value: "product", label: "Product" },
  { value: "project", label: "Project" },
  { value: "staffing", label: "Staffing" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
] as const satisfies Option[];

export function values<T extends readonly Option[]>(options: T) {
  return options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];
}

export function labelFor(
  options: readonly Option[],
  value: string | undefined,
): string | undefined {
  return options.find((option) => option.value === value)?.label ?? value;
}
