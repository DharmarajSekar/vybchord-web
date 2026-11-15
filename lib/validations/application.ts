import { z } from "zod";
import {
  consentSchema,
  requiredDocument,
  emailSchema,
  nameSchema,
  optionalText,
  optionalUrl,
  phoneSchema,
} from "./shared";

export const CV_MAX_MB = 5;

/** F4 Job application. */
export const applicationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  job_id: z.uuid("This role is no longer available"),
  cv: requiredDocument(CV_MAX_MB, "Attach your CV as a PDF or Word document"),
  experience_years: z.coerce
    .number({ error: "Enter your years of experience" })
    .min(0, "Cannot be negative")
    .max(50, "Enter a number up to 50"),
  linkedin: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
  notice_period: optionalText(60),
  location: optionalText(120),
  expected_ctc: optionalText(60),
  consent: consentSchema,
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationValues = z.output<typeof applicationSchema>;
