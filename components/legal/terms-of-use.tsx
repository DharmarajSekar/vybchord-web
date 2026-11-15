import Link from "next/link";
import type { SiteSettings } from "@/lib/data/site-settings";

/** FR-P12 Terms of Use for the website (not for client contracts). */
export function TermsOfUse({ settings }: { settings: SiteSettings | null }) {
  const company = settings?.legal_name ?? "Vybchord";
  const email = settings?.email;

  return (
    <>
      <p>
        These terms apply to your use of this website, operated by {company}{" "}
        (&ldquo;Vybchord&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you accept
        them. Our products and services are provided under separate written agreements; these terms
        do not cover them.
      </p>

      <h2 id="use">1. Using the site</h2>
      <p>You may browse the site and share links to it. You agree not to:</p>
      <ul>
        <li>use the site for anything unlawful, or to send spam or harmful code;</li>
        <li>try to break, overload or gain unauthorised access to the site or its systems;</li>
        <li>submit false information, or someone else&rsquo;s personal data without permission;</li>
        <li>copy the site&rsquo;s content in bulk, including with automated tools.</li>
      </ul>

      <h2 id="content">2. Our content</h2>
      <p>
        The text, designs, product names, logos and software shown on this site belong to us or our
        licensors. Product screenshots and descriptions are for information. You may not reuse them
        without our written permission.
      </p>

      <h2 id="information">3. Information on the site</h2>
      <p>
        We work to keep the site accurate, but content is general information, not an offer or
        professional advice. Product features, availability, timelines and pricing are confirmed
        only in a written proposal or agreement.
      </p>

      <h2 id="submissions">4. What you send us</h2>
      <p>
        When you send us an enquiry, brief or application, you confirm you have the right to share
        it. We treat it as described in our <Link href="/legal/privacy">Privacy Policy</Link>.
        Sending a brief does not create a contract or a confidentiality obligation beyond that
        policy; we sign NDAs on request before detailed discussions.
      </p>

      <h2 id="links">5. Links to other sites</h2>
      <p>
        The site links to other websites, such as booking and social media. We are not responsible
        for their content or practices.
      </p>

      <h2 id="liability">6. Liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. To the extent the law allows, we are not liable
        for any indirect or consequential loss arising from your use of the site, or for
        interruptions or errors. Nothing in these terms limits liability that cannot be limited by
        law.
      </p>

      <h2 id="law">7. Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at Chennai, Tamil Nadu, have
        exclusive jurisdiction over any dispute about them.
      </p>

      <h2 id="changes">8. Changes and contact</h2>
      <p>
        We may update these terms and will show the new date at the top of this page.
        {email && (
          <>
            {" "}
            Questions: <a href={`mailto:${email}`}>{email}</a>.
          </>
        )}
      </p>
    </>
  );
}
