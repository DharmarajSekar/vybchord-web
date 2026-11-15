import Link from "next/link";
import { CookieSettingsButton } from "@/components/site/cookie-settings-button";
import { LegalTable } from "./legal-prose";

const necessary = [
  [
    "vybchord-consent",
    "Your browser (local storage)",
    "Remembers your cookie choice and when you made it",
    "Until you change it",
  ],
  ["theme", "Your browser (local storage)", "Remembers light or dark mode", "Until you change it"],
  [
    "vybchord-utm",
    "Your browser (session storage)",
    "Remembers the campaign link you arrived from, sent only if you submit a form",
    "Until you close the tab",
  ],
  [
    "Cloudflare Turnstile",
    "Cloudflare",
    "Checks that form submissions come from a person, not a bot",
    "Session",
  ],
];

const analytics = [
  ["_ga, _ga_*", "Google Analytics", "Counts visits and shows how pages are used", "Up to 2 years"],
  [
    "_clck, _clsk, CLID and related",
    "Microsoft Clarity",
    "Shows how visitors interact with pages, with personal details masked",
    "Up to 1 year",
  ],
];

function CookieTable({ rows }: { rows: string[][] }) {
  return (
    <LegalTable>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Set by</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, by, purpose, duration]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{by}</td>
              <td>{purpose}</td>
              <td>{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LegalTable>
  );
}

/** FR-P12 Cookie Policy, matching the consent banner (FR-G5). */
export function CookiePolicy() {
  return (
    <>
      <p>
        Cookies and similar technologies (such as your browser&rsquo;s local storage) store small
        pieces of information on your device. This page explains which ones this website uses.
      </p>

      <h2 id="necessary">Strictly necessary</h2>
      <p>These keep the site working and secure. They do not need your consent.</p>
      <CookieTable rows={necessary} />

      <h2 id="analytics">Analytics (only with your consent)</h2>
      <p>
        These load only if you choose &ldquo;Accept analytics&rdquo; in the cookie banner. If you
        reject, or never choose, they are not loaded.
      </p>
      <CookieTable rows={analytics} />

      <h2 id="embeds">Embedded content</h2>
      <p>
        Our Contact and About pages can show a Google Maps map of our office. It loads only when you
        choose &ldquo;Show map&rdquo;, and Google may then set its own cookies. Booking a call opens
        Cal.com in a new tab, under its own policy.
      </p>

      <h2 id="control">Changing your choice</h2>
      <p>
        You can change your analytics choice at any time:{" "}
        <CookieSettingsButton className="font-medium underline underline-offset-4" />. You can also
        delete cookies and site data in your browser settings. For how we handle personal data, see
        our <Link href="/legal/privacy">Privacy Policy</Link>.
      </p>
    </>
  );
}
