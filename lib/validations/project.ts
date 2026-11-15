import { z } from "zod";
import { budgetRanges, projectTypes, timelines, values } from "./options";
import {
  consentSchema,
  optionalDocument,
  emailSchema,
  nameSchema,
  optionalChoice,
  optionalPhone,
} from "./shared";

export const PROJECT_ATTACHMENT_MAX_MB = 10;

/** F2 Project enquiry. */
export const projectSchema = z.object({
  name: nameSchema,
  work_email: emailSchema,
  company: z.string().trim().min(2, "Enter your company name").max(160),
  project_type: z.enum(values(projectTypes), { error: "Choose a project type" }),
  description: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters)")
    .max(5000, "Keep this under 5,000 characters"),
  budget_range: optionalChoice(values(budgetRanges)),
  timeline: optionalChoice(values(timelines)),
  phone: optionalPhone,
  attachment: optionalDocument(PROJECT_ATTACHMENT_MAX_MB),
  consent: consentSchema,
});

export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectValues = z.output<typeof projectSchema>;
