import { CalendarIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/data/site-settings";
import { bookingUrl } from "@/lib/site/booking";
import { OfficeMap } from "./office-map";

/** FR-P11 sidebar: email, phone, address, map and booking link (all from site_settings / env). */
export function ContactDetails({ settings }: { settings: SiteSettings | null }) {
  const booking = bookingUrl();
  const address = settings?.registered_office;
  const linkClass = "underline-offset-4 hover:underline";

  return (
    <aside aria-label="Contact details" className="space-y-6">
      {booking && (
        <div className="rounded-xl bg-muted/50 p-6">
          <h2 className="font-semibold">Prefer to talk?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a time that suits you for a call with our team.
          </p>
          <a
            href={booking}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", className: "mt-4" })}
          >
            <CalendarIcon aria-hidden />
            Book a call
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      <dl className="space-y-4 text-sm">
        {settings?.email && (
          <div className="flex gap-3">
            <dt>
              <MailIcon className="size-5 text-muted-foreground" aria-hidden />
              <span className="sr-only">Email</span>
            </dt>
            <dd>
              <a href={`mailto:${settings.email}`} className={linkClass}>
                {settings.email}
              </a>
            </dd>
          </div>
        )}
        {settings?.phone && (
          <div className="flex gap-3">
            <dt>
              <PhoneIcon className="size-5 text-muted-foreground" aria-hidden />
              <span className="sr-only">Phone</span>
            </dt>
            <dd>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                {settings.phone}
              </a>
            </dd>
          </div>
        )}
        {address && (
          <div className="flex gap-3">
            <dt>
              <MapPinIcon className="size-5 text-muted-foreground" aria-hidden />
              <span className="sr-only">Registered office</span>
            </dt>
            <dd className="whitespace-pre-line">
              {settings?.legal_name && <span className="font-medium">{settings.legal_name}</span>}
              {"\n"}
              {address}
            </dd>
          </div>
        )}
      </dl>

      {address && <OfficeMap address={address} />}
    </aside>
  );
}
