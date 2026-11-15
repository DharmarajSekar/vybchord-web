import Link from "next/link";
import type { SiteSettings } from "@/lib/data/site-settings";
import { footerNav, legalNav } from "@/lib/site/navigation";
import { CookieSettingsButton } from "./cookie-settings-button";
import { Logo } from "./logo";

const linkClass =
  "rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

const socialLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  x: "X",
  twitter: "X",
  github: "GitHub",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
};

function socialLabel(key: string) {
  return socialLabels[key.toLowerCase()] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

/** FR-G2: company identity from `site_settings`, plus site and legal links. */
export function Footer({ settings }: { settings: SiteSettings | null }) {
  const socials = Object.entries(settings?.socials ?? {});

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-4 text-sm">
          <Logo />
          {settings && (
            <address className="space-y-1 text-muted-foreground not-italic">
              <p className="font-medium text-foreground">{settings.legal_name}</p>
              {settings.cin && <p>CIN: {settings.cin}</p>}
              {settings.gstin && <p>GSTIN: {settings.gstin}</p>}
              {settings.registered_office && (
                <p className="whitespace-pre-line">{settings.registered_office}</p>
              )}
              {settings.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className={linkClass}>
                    {settings.email}
                  </a>
                </p>
              )}
              {settings.phone && (
                <p>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                    {settings.phone}
                  </a>
                </p>
              )}
            </address>
          )}
          {socials.length > 0 && (
            <ul aria-label="Social media" className="flex flex-wrap gap-x-4 gap-y-1">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {socialLabel(key)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title} className="text-sm">
            <h2 className="mb-3 font-medium">{group.title}</h2>
            <ul className="space-y-2">
              {group.items.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings?.legal_name}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legalNav.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={linkClass} />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
