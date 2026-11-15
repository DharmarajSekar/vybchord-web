import { z } from "zod";
import { Constants } from "@/lib/supabase/types";
import { emailSchema } from "../shared";
import { optText, stringList } from "./shared";

const { app_status, lead_status } = Constants.public.Enums;

/** FR-A2 lead status flow: new → contacted → qualified → proposal → won | lost. */
export const leadStatusSchema = z.object({ id: z.uuid(), status: z.enum(lead_status) });
export const leadNoteSchema = z.object({
  lead_id: z.uuid(),
  note: z.string().trim().min(1, "Write a note").max(2000, "Keep notes under 2,000 characters"),
});

/** FR-A6/A7 application status flow and bench skills. */
export const applicationStatusSchema = z.object({ id: z.uuid(), status: z.enum(app_status) });
export const applicationSkillsSchema = z.object({ id: z.uuid(), skills: stringList(30, 40) });

const optUrl = z.union([
  z.url({ protocol: /^https?$/, error: "Enter a full https:// link" }),
  z.literal(""),
]);
const optEmail = z.union([emailSchema, z.literal("")]);

/** FR-A8 settings: company identity, socials, announcement bar, Grievance Officer. */
export const settingsSchema = z.object({
  legal_name: z.string().trim().min(2, "Enter the legal name").max(200),
  cin: z.union([
    z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, "Enter a valid 21-character CIN"),
    z.literal(""),
  ]),
  gstin: z.union([
    z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[0-9]{2}[A-Z0-9]{10}[0-9A-Z]Z[0-9A-Z]$/, "Enter a valid 15-character GSTIN"),
    z.literal(""),
  ]),
  registered_office: optText(400),
  email: optEmail,
  phone: optText(30),
  whatsapp: z.union([
    z
      .string()
      .trim()
      .regex(/^\+?[0-9 ]{10,18}$/, "Digits with country code, e.g. 91 98765 43210"),
    z.literal(""),
  ]),
  socials: z.object({
    linkedin: optUrl,
    x: optUrl,
    github: optUrl,
    youtube: optUrl,
    instagram: optUrl,
    facebook: optUrl,
  }),
  announcement: optText(200),
  grievance_officer_name: optText(120),
  grievance_officer_email: optEmail,
});

export type SettingsInput = z.input<typeof settingsSchema>;
export type SettingsValues = z.output<typeof settingsSchema>;
