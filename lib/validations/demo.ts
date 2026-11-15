import { z } from "zod";
import { companySizes, interestTypes, timelines, values } from "./options";
import {
  consentSchema,
  emailSchema,
  nameSchema,
  optionalChoice,
  optionalPhone,
  optionalText,
} from "./shared";

/** F1 Product demo / licensing. */
export const demoSchema = z.object({
  name: nameSchema,
  work_email: emailSchema,
  company: z.string().trim().min(2, "Enter your company name").max(160),
  product: z.string().trim().min(1, "Choose a product").max(80),
  interest_type: z.enum(values(interestTypes), { error: "Choose what you are interested in" }),
  phone: optionalPhone,
  company_size: optionalChoice(values(companySizes)),
  timeline: optionalChoice(values(timelines)),
  message: optionalText(2000),
  consent: consentSchema,
});

export type DemoInput = z.input<typeof demoSchema>;
export type DemoValues = z.output<typeof demoSchema>;
