import { z } from "zod";
import { emailSchema } from "../shared";

export const loginSchema = z.object({
  email: emailSchema,
  next: z.string().max(300).optional(),
});
