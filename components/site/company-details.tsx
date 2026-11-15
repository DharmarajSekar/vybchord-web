import type { SiteSettings } from "@/lib/data/site-settings";

/** Legal entity details for procurement and vendor onboarding (BRD §4), from site_settings. */
export function CompanyDetails({ settings }: { settings: SiteSettings }) {
  const rows = [
    { label: "Legal name", value: settings.legal_name },
    { label: "CIN", value: settings.cin },
    { label: "GSTIN", value: settings.gstin },
    { label: "Registered office", value: settings.registered_office },
    { label: "Email", value: settings.email },
    { label: "Phone", value: settings.phone },
  ].filter((row) => row.value);

  return (
    <dl className="divide-y rounded-xl ring-1 ring-foreground/10">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-muted-foreground">{row.label}</dt>
          <dd className="text-sm font-medium break-words whitespace-pre-line">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
