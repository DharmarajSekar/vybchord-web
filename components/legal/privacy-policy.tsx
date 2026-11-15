import Link from "next/link";
import type { SiteSettings } from "@/lib/data/site-settings";
import { LegalTable } from "./legal-prose";
import { PrivacyRights } from "./privacy-rights";

/** Privacy Policy aligned to the Digital Personal Data Protection Act, 2023 (FR-P12, NFR-6). */
export function PrivacyPolicy({ settings }: { settings: SiteSettings | null }) {
  const company = settings?.legal_name ?? "Vybchord";

  return (
    <>
      <p>
        This policy explains how {company} (&ldquo;Vybchord&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects and uses personal data through this website, and the rights you
        have under India&rsquo;s Digital Personal Data Protection Act, 2023 (&ldquo;DPDP
        Act&rdquo;). For that data we are the Data Fiduciary, and you are the Data Principal.
      </p>

      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        {company}
        {settings?.cin && <>, CIN {settings.cin}</>}
        {settings?.registered_office && (
          <>, with its registered office at {settings.registered_office}</>
        )}
        . You can reach us using the details in section 11.
      </p>

      <h2 id="what-we-collect">2. Personal data we collect</h2>
      <p>We only collect what you give us, plus a small amount of technical data:</p>
      <LegalTable>
        <table>
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">What</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Demo, licensing, project or staffing enquiry</td>
              <td>
                Name, work email, company, phone (optional), your requirements and any document you
                attach
              </td>
            </tr>
            <tr>
              <td>General contact form</td>
              <td>Name, email, company and phone (optional), your message</td>
            </tr>
            <tr>
              <td>Job application</td>
              <td>
                Name, email, phone, CV, years of experience, and optionally LinkedIn, GitHub or
                portfolio links, notice period, location and expected salary
              </td>
            </tr>
            <tr>
              <td>Newsletter</td>
              <td>Email address</td>
            </tr>
            <tr>
              <td>Every form</td>
              <td>
                The time you gave consent, the page you submitted from and any campaign (UTM) tags
                in the link you followed
              </td>
            </tr>
            <tr>
              <td>Spam protection</td>
              <td>
                A one-way hash of your IP address, used only to limit repeated submissions, and the
                result of a Cloudflare Turnstile security check
              </td>
            </tr>
            <tr>
              <td>Analytics (only if you accept)</td>
              <td>
                How you use the site, collected by Google Analytics and Microsoft Clarity. See our{" "}
                <Link href="/legal/cookies">Cookie Policy</Link>.
              </td>
            </tr>
          </tbody>
        </table>
      </LegalTable>
      <p>
        Please do not include sensitive information, such as health or financial details, in forms.
      </p>

      <h2 id="why">3. Why we use it</h2>
      <p>
        We process personal data on the basis of your consent (section 6 of the DPDP Act), which you
        give with the checkbox on each form. Each checkbox states its purpose:
      </p>
      <ul>
        <li>to respond to your demo, licensing, project, staffing or general enquiry;</li>
        <li>to assess your job application for that role and similar roles;</li>
        <li>to send you the newsletter you asked for, after you confirm your email address;</li>
        <li>with your separate cookie consent, to understand and improve how the site is used.</li>
      </ul>
      <p>
        We also use limited data to keep the site secure, such as blocking spam and abuse. We do not
        sell personal data or use it for automated decisions about you.
      </p>

      <h2 id="consent">4. Your consent and withdrawing it</h2>
      <p>
        Consent is optional, but we cannot respond to a form without it. You can withdraw consent at
        any time, as easily as you gave it: email us (section 11), use the unsubscribe link in any
        newsletter, or change analytics consent under &ldquo;Cookie settings&rdquo; in the site
        footer. Withdrawal does not affect processing that happened before it. After you withdraw,
        we stop processing and delete your data unless the law requires us to keep it.
      </p>

      <h2 id="sharing">5. Who we share it with</h2>
      <p>
        We share personal data only with service providers (Data Processors) that process it for us
        under contract, and only as needed:
      </p>
      <ul>
        <li>Supabase: database and secure file storage;</li>
        <li>Resend: sending confirmation and notification emails;</li>
        <li>Cloudflare: the Turnstile security check on forms;</li>
        <li>Hostinger: website hosting and our company email;</li>
        <li>Google Analytics and Microsoft Clarity: analytics, only with your consent;</li>
        <li>Google Maps: the office map on our Contact and About pages;</li>
        <li>Cal.com: if you choose to book a call through our booking link.</li>
      </ul>
      <p>
        Some of these providers process data outside India. We transfer data only as the DPDP Act
        permits, and not to any country the Government of India has restricted. We may also disclose
        data when required by law.
      </p>

      <h2 id="retention">6. How long we keep it</h2>
      <ul>
        <li>
          Enquiries: as long as needed to respond and to manage any business relationship that
          follows, then deleted.
        </li>
        <li>
          Job applications and CVs: up to 12 months after you apply, so we can consider you for
          similar roles, then deleted. You can ask us to delete them sooner.
        </li>
        <li>Newsletter: until you unsubscribe.</li>
        <li>Spam-protection records: kept briefly and never linked to your identity.</li>
        <li>Analytics: according to the retention settings of the analytics providers.</li>
      </ul>

      <PrivacyRights settings={settings} />
    </>
  );
}
