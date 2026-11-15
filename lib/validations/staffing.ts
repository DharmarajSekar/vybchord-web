import { z } from "zod";
import { engagementModels, roleOptions, values, workModeOptions } from "./options";
import { consentSchema, emailSchema, nameSchema, optionalChoice, optionalText } from "./shared";

/** F3 Staff augmentation. */
export const staffingSchema = z.object({
  name: nameSchema,
  work_email: emailSchema,
  company: z.string().trim().min(2, "Enter your company name").max(160),
  roles: z
    .array(z.enum(values(roleOptions)))
    .min(1, "Choose at least one role")
    .max(roleOptions.length),
  headcount: z.coerce
    .number({ error: "Enter how many engineers you need" })
    .int("Use a whole number")
    .min(1, "At least 1")
    .max(200, "For more than 200, tell us in the skills field"),
  start_date: z.iso.date("Choose a start date"),
  duration_months: z
    .union([
      z.coerce.number().int().min(1, "At least 1 month").max(60, "Up to 60 months"),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  engagement_model: optionalChoice(values(engagementModels)),
  work_mode: optionalChoice(values(workModeOptions)),
  location: optionalText(120),
  skills: optionalText(1000),
  budget_per_resource: optionalText(120),
  consent: consentSchema,
});

export type StaffingInput = z.input<typeof staffingSchema>;
export type StaffingValues = z.output<typeof staffingSchema>;
