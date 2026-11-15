import { z } from "zod";
import { consentSchema, emailSchema } from "./shared";

/** F6 Newsletter (double opt-in). */
export const newsletterSchema = z.object({
  email: emailSchema,
  consent: consentSchema,
});

export type NewsletterInput = z.input<typeof newsletterSchema>;
export type NewsletterValues = z.output<typeof newsletterSchema>;
