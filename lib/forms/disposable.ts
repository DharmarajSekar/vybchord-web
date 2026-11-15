import "server-only";
import domains from "disposable-email-domains";

let blocked: Set<string> | null = null;

/** FRD §4 rule 1: F1–F3 reject throwaway inboxes. Server-only: the list is ~120k domains. */
export function isDisposableEmail(email: string): boolean {
  blocked ??= new Set(domains);
  const domain = email.split("@")[1]?.toLowerCase();
  return Boolean(domain && blocked.has(domain));
}
