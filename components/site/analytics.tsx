"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

// IDs are validated before being interpolated into inline scripts.
const GA_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_ID
  : undefined;
const CLARITY_ID = /^[a-z0-9]+$/i.test(process.env.NEXT_PUBLIC_CLARITY_ID ?? "")
  ? process.env.NEXT_PUBLIC_CLARITY_ID
  : undefined;

/** FR-G5: GA4 and Clarity are only injected after the visitor accepts analytics. */
export function Analytics() {
  const consent = useConsent();
  if (!consent?.analytics) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}
