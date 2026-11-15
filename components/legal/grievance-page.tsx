import Link from "next/link";
import type { SiteSettings } from "@/lib/data/site-settings";
import { GrievanceContact } from "./grievance-contact";

/** FR-P12 Grievance Officer page: DPDP Act 2023 grievance redressal (section 13). */
export function GrievancePage({ settings }: { settings: SiteSettings | null }) {
  return (
    <>
      <p>
        Our Grievance Officer handles questions, requests and complaints about how we process
        personal data, under India&rsquo;s Digital Personal Data Protection Act, 2023.
      </p>
      <GrievanceContact settings={settings} />

      <h2 id="what">What you can raise</h2>
      <ul>
        <li>a request to see, correct, update or delete your personal data;</li>
        <li>withdrawing consent you gave on one of our forms;</li>
        <li>nominating someone to act for you;</li>
        <li>a complaint about how we have handled your personal data.</li>
      </ul>

      <h2 id="how">How to raise it</h2>
      <p>Email the Grievance Officer and include:</p>
      <ol>
        <li>your name and the email address you used with us;</li>
        <li>
          what your request or complaint is about, for example a job application or an enquiry;
        </li>
        <li>what you would like us to do.</li>
      </ol>
      <p>
        We acknowledge every request and respond within the time required by law. We may ask you to
        confirm your identity before we share or change any data.
      </p>

      <h2 id="escalation">If you are not satisfied</h2>
      <p>
        After using this process, you may complain to the Data Protection Board of India under
        section 13(3) of the DPDP Act. See our <Link href="/legal/privacy">Privacy Policy</Link> for
        how we handle personal data.
      </p>
    </>
  );
}
