import { z } from "zod";
import { contactTopics, values } from "./options";
import { consentSchema, emailSchema, nameSchema, optionalPhone, optionalText } from "./shared";

/** F5 General contact. */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  topic: z.enum(values(contactTopics), { error: "Choose a topic" }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(5000, "Keep this under 5,000 characters"),
  phone: optionalPhone,
  company: optionalText(160),
  consent: consentSchema,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;
