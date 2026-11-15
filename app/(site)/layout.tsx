import { Analytics } from "@/components/site/analytics";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { ConsentBanner } from "@/components/site/consent-banner";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { toWhatsAppNumber, WhatsAppButton } from "@/components/site/whatsapp-button";
import { getSiteSettings } from "@/lib/data/site-settings";

// Static with hourly ISR; admin settings edits should also call revalidatePath("/", "layout").
export const revalidate = 3600;

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const whatsapp = toWhatsAppNumber(settings?.whatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <AnnouncementBar message={settings?.announcement} />
      <Header />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton number={whatsapp} />
      <ConsentBanner />
      <Analytics />
    </>
  );
}
