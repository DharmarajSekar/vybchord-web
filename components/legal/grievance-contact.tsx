import type { SiteSettings } from "@/lib/data/site-settings";

/** Grievance Officer contact block (DPDP Act 2023, s.8(10) and s.13), from site_settings. */
export function GrievanceContact({ settings }: { settings: SiteSettings | null }) {
  const email = settings?.grievance_officer_email ?? settings?.email;

  return (
    <div className="my-6 rounded-xl bg-muted/50 p-5 not-italic">
      <p className="!my-0 font-semibold">Grievance Officer</p>
      {settings?.grievance_officer_name && (
        <p className="!my-1">{settings.grievance_officer_name}</p>
      )}
      {settings?.legal_name && <p className="!my-1">{settings.legal_name}</p>}
      {settings?.registered_office && (
        <p className="!my-1 whitespace-pre-line">{settings.registered_office}</p>
      )}
      {email && (
        <p className="!my-1">
          Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </div>
  );
}

/** Contact address for data requests: the Grievance Officer if set, else the company email. */
export function privacyEmail(settings: SiteSettings | null): string | null {
  return settings?.grievance_officer_email ?? settings?.email ?? null;
}
