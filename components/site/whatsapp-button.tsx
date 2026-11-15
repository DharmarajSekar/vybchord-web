import { MessageCircleIcon } from "lucide-react";

/** Digits only, international format without "+"; rejects unset or template values. */
export function toWhatsAppNumber(value: string | null | undefined): string | null {
  const digits = value?.replace(/\D/g, "") ?? "";
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

/** FR-G4: floating click-to-chat button, mobile only. */
export function WhatsAppButton({ number }: { number: string | null }) {
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:outline-none md:hidden"
    >
      <MessageCircleIcon className="size-7" aria-hidden />
      <span className="sr-only">Chat with us on WhatsApp (opens in a new tab)</span>
    </a>
  );
}
