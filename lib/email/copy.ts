import type { FormKey } from "@/lib/forms/types";
import { bookingUrl } from "@/lib/site/booking";
import type { AutoReplyContent } from "./templates/auto-reply";

/** Auto-reply copy per form; each keeps the FRD §4 "auto-reply promise". */
export function autoReplyCopy(
  form: FormKey,
  extra: { confirmUrl?: string } = {},
): AutoReplyContent {
  const booking = bookingUrl();
  const book = booking ? { label: "Book a time now", href: booking } : undefined;

  switch (form) {
    case "demo":
      return {
        subject: "We received your demo request",
        heading: "Thanks — your demo request is in",
        paragraphs: [
          "We will reply within one business day to set up a walkthrough for your team.",
          booking
            ? "If you would like to pick a time straight away, use the link below."
            : "If anything changes in the meantime, just reply to this email.",
        ],
        cta: book,
      };
    case "project":
      return {
        subject: "We received your project enquiry",
        heading: "Thanks — your project brief is in",
        paragraphs: [
          "We will review your brief and contact you within one business day to set up a discovery call.",
          "If you have more documents to share, reply to this email and attach them.",
        ],
        cta: book,
      };
    case "staffing":
      return {
        subject: "We received your engineer request",
        heading: "Thanks — we are matching engineers for you",
        paragraphs: [
          "You will receive matching profiles within 48 hours.",
          "If your requirements change, reply to this email and we will update the search.",
        ],
      };
    case "application":
      return {
        subject: "We received your application",
        heading: "Thanks for applying",
        paragraphs: [
          "We have received your application and CV. Our team reviews every application.",
          "If your profile matches the role, we will contact you about next steps.",
        ],
      };
    case "contact":
      return {
        subject: "We received your message",
        heading: "Thanks for getting in touch",
        paragraphs: ["We will reply within one business day."],
      };
    case "newsletter":
      return {
        subject: "Confirm your subscription",
        heading: "Please confirm your subscription",
        paragraphs: [
          "Click the button below to confirm you want to receive our insights by email.",
          "If you did not sign up, ignore this email and you will not be subscribed.",
        ],
        cta: extra.confirmUrl
          ? { label: "Confirm subscription", href: extra.confirmUrl }
          : undefined,
      };
  }
}
