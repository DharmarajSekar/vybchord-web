"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { onOpenConsentSettings, saveConsent, useConsent } from "@/lib/consent";

/**
 * FR-G5 / NFR-6: asks on first visit; "Reject" is as prominent as "Accept".
 * Reopened from the footer "Cookie settings" link.
 */
export function ConsentBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenConsentSettings(() => setReopened(true)), []);

  if (consent === undefined || (consent && !reopened)) return null;

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setReopened(false);
  };

  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/85"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1 text-sm">
          <h2 id="consent-title" className="font-medium">
            Analytics cookies
          </h2>
          <p className="text-muted-foreground">
            With your consent, we use Google Analytics and Microsoft Clarity to understand how the
            site is used and improve it. Essential cookies only keep the site working. You can
            change this any time under Cookie settings.{" "}
            <Link href="/legal/cookies" className="underline underline-offset-4">
              Cookie Policy
            </Link>
          </p>
          {consent && (
            <p className="text-xs text-muted-foreground">
              Current choice: analytics {consent.analytics ? "allowed" : "not allowed"}.
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => choose(false)}>
            Reject
          </Button>
          <Button size="lg" className="flex-1" onClick={() => choose(true)}>
            Accept analytics
          </Button>
        </div>
      </div>
    </section>
  );
}
