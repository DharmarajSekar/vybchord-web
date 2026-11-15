import type { Enums } from "@/lib/supabase/types";

export const formTypeLabel: Record<Enums<"lead_form_type">, string> = {
  demo: "Demo / licensing",
  project: "Project",
  staffing: "Staffing",
  contact: "Contact",
  newsletter: "Newsletter",
};

export const leadStatusLabel: Record<Enums<"lead_status">, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export const appStatusLabel: Record<Enums<"app_status">, string> = {
  new: "New",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  bench: "Bench",
};

export const productStatusLabel: Record<Enums<"product_status">, string> = {
  live: "Live",
  pilot: "Pilot",
  coming_soon: "Coming soon",
};

export const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const dateTime = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export function formatDateTime(iso: string | null | undefined): string {
  return iso ? dateTime.format(new Date(iso)) : "—";
}

/** payload keys such as "budget_range" → "Budget range". */
export function humanize(key: string): string {
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
