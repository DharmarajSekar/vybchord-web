import Link from "next/link";
import type { SiteSettings } from "@/lib/data/site-settings";
import { GrievanceContact, privacyEmail } from "./grievance-contact";

/** Privacy Policy sections 7–12: security, rights, children, grievances and changes. */
export function PrivacyRights({ settings }: { settings: SiteSettings | null }) {
  const email = privacyEmail(settings);

  return (
    <>
      <h2 id="security">7. How we protect it</h2>
      <p>
        We use reasonable security safeguards, as section 8(5) of the DPDP Act requires. These
        include encryption in transit, private storage for CVs and attachments, access limited to
        authorised staff, and database rules that stop the public from reading submitted data. If a
        personal data breach occurs, we will inform the Data Protection Board of India and affected
        people as the law requires.
      </p>

      <h2 id="rights">8. Your rights</h2>
      <p>Under the DPDP Act you can ask us to:</p>
      <ul>
        <li>
          give you a summary of the personal data we hold about you, how we use it, and who we have
          shared it with (section 11);
        </li>
        <li>correct, complete or update inaccurate or incomplete data (section 12);</li>
        <li>
          erase your data when it is no longer needed for the purpose you consented to (section 12);
        </li>
        <li>handle a grievance about how we have processed your data (section 13);</li>
        <li>
          accept a person you nominate to exercise these rights if you die or become unable to
          (section 14).
        </li>
      </ul>
      <p>
        To use any of these rights, email {email ? <a href={`mailto:${email}`}>{email}</a> : "us"}{" "}
        from the address you used with us, or tell us how to verify your identity. We may need to
        confirm who you are before acting on a request.
      </p>

      <h2 id="children">9. Children</h2>
      <p>
        This website is for businesses and job seekers aged 18 or over. We do not knowingly collect
        personal data from children. If you believe a child has sent us personal data, contact us
        and we will delete it.
      </p>

      <h2 id="duties">10. Your responsibilities</h2>
      <p>
        Please give us accurate information, and do not submit someone else&rsquo;s personal data
        without their permission (section 15 of the DPDP Act).
      </p>

      <h2 id="grievance">11. Grievance Officer and contact</h2>
      <p>
        For any privacy question, request or complaint, contact our Grievance Officer. More detail
        on the process is on our <Link href="/legal/grievance">Grievance Officer</Link> page.
      </p>
      <GrievanceContact settings={settings} />
      <p>
        If you are not satisfied with our response, you may complain to the Data Protection Board of
        India after first using our grievance process (section 13(3) of the DPDP Act).
      </p>

      <h2 id="changes">12. Changes to this policy</h2>
      <p>
        We will update this policy when our practices or the law change, and show the new date at
        the top of this page. If a change significantly affects how we use your data, we will ask
        for your consent again where required.
      </p>
    </>
  );
}
