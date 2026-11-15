import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { organizationJsonLd } from "@/lib/seo";
import { Analytics } from "./analytics";
import { AnnouncementBar } from "./announcement-bar";
import { ConsentBanner } from "./consent-banner";
import { Footer } from "./footer";
import { Header } from "./header";
import { JsonLd } from "./json-ld";
import { toWhatsAppNumber, WhatsAppButton } from "./whatsapp-button";

/**
 * Public-site chrome: header, footer, consent, analytics, WhatsApp and Organization JSON-LD.
 * Used by the (site) layout and by the root 404, which renders outside that layout.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const whatsapp = toWhatsAppNumber(settings?.whatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const organization = organizationJsonLd(settings);

  return (
    <>
      {organization && <JsonLd data={organization} />}
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <AnnouncementBar message={settings?.announcement} />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton number={whatsapp} />
      <ConsentBanner />
      <Analytics />
    </>
  );
}
