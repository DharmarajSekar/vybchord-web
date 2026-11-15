import "server-only";
import { verifyTurnstile } from "@/lib/turnstile";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/validations/shared";
import { isWithinRateLimit } from "./rate-limit";
import { getClientIp, hashIp } from "./request";
import type { ActionResult, FormKey } from "./types";

type GuardResult = { kind: "pass" } | { kind: "spam" } | { kind: "reject"; result: ActionResult };

/** Tech spec §4 steps 2–4: honeypot, Turnstile, rate limit — in that order. */
export async function guardSubmission(formData: FormData, form: FormKey): Promise<GuardResult> {
  // Bots that fill the hidden field get a normal-looking success and nothing is stored.
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim()) return { kind: "spam" };

  const ip = await getClientIp();
  const token = formData.get(TURNSTILE_FIELD);
  if (!(await verifyTurnstile(typeof token === "string" ? token : null, ip))) {
    return {
      kind: "reject",
      result: {
        ok: false,
        message:
          "We could not verify you are human. Please complete the security check and try again.",
      },
    };
  }

  if (!(await isWithinRateLimit(`${form}:${hashIp(ip)}`))) {
    return {
      kind: "reject",
      result: {
        ok: false,
        message: "Too many submissions from your network. Please wait a few minutes and try again.",
      },
    };
  }

  return { kind: "pass" };
}
