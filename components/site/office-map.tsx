"use client";

import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Office map that loads Google Maps only when asked. Saves ~400 KB of third-party code on page
 * load (NFR-1) and sets no Google cookies until the visitor chooses to see the map (NFR-6).
 */
export function OfficeMap({ address }: { address: string }) {
  const [show, setShow] = useState(false);
  const query = encodeURIComponent(address);

  if (show) {
    return (
      <iframe
        title="Office location map"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full rounded-xl border-0 bg-muted"
      />
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl bg-muted p-6 text-center">
      <MapPinIcon className="size-8 text-muted-foreground" aria-hidden />
      <p className="max-w-xs text-sm">
        The map is provided by Google, which may set cookies when it loads.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" onClick={() => setShow(true)}>
          Show map
        </Button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 px-2.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          Open in Google Maps
          <ExternalLinkIcon className="size-4" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
