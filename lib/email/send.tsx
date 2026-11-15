import "server-only";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { getSiteSettings } from "@/lib/data/site-settings";
import type { FormKey } from "@/lib/forms/types";
import { absoluteUrl } from "@/lib/seo";
import { autoReplyCopy } from "./copy";
import { AutoReplyEmail } from "./templates/auto-reply";
import { LeadAlertEmail, type EmailField } from "./templates/lead-alert";

type Message = { to: string; subject: string; email: ReactElement; replyTo?: string };

/** Sends one email. Never throws: failures are logged (tech spec §4 step 7). */
async function send({ to, subject, email, replyTo }: Message): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    console.warn("[email] RESEND_API_KEY or MAIL_FROM not set; skipped:", subject);
    return false;
  }
  try {
    const [html, text] = await Promise.all([render(email), render(email, { plainText: true })]);
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
    });
    if (error) {
      console.error("[email] send failed:", subject, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] send threw:", subject, error);
    return false;
  }
}

type LeadEmails = {
  form: FormKey;
  title: string;
  visitor: { email: string; name?: string };
  fields: EmailField[];
  /** Admin path for the new record, e.g. /admin/leads/<id>. */
  adminPath?: string;
};

/** Founder alert + visitor auto-reply, sent in parallel. */
export async function sendLeadEmails({ form, title, visitor, fields, adminPath }: LeadEmails) {
  const settings = await getSiteSettings().catch(() => null);
  const content = autoReplyCopy(form);
  const alertTo = process.env.LEAD_ALERT_EMAIL;
  const hasSiteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  await Promise.all([
    alertTo
      ? send({
          to: alertTo,
          subject: `[${title}] ${visitor.name ?? visitor.email}`,
          replyTo: visitor.email,
          email: (
            <LeadAlertEmail
              title={title}
              fields={fields}
              adminUrl={adminPath && hasSiteUrl ? absoluteUrl(adminPath) : null}
            />
          ),
        })
      : Promise.resolve(console.warn("[email] LEAD_ALERT_EMAIL not set; founder alert skipped")),
    send({
      to: visitor.email,
      subject: content.subject,
      replyTo: alertTo,
      email: <AutoReplyEmail name={visitor.name} content={content} footer={settings?.legal_name} />,
    }),
  ]);
}

/** F6 double opt-in confirmation. */
export async function sendNewsletterConfirmation(email: string, confirmUrl: string) {
  const settings = await getSiteSettings().catch(() => null);
  const content = autoReplyCopy("newsletter", { confirmUrl });
  return send({
    to: email,
    subject: content.subject,
    email: <AutoReplyEmail content={content} footer={settings?.legal_name} />,
  });
}
