import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text wordmark until the brand logo asset is supplied (FRD phase 0). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "rounded-md text-lg font-semibold tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      Vybchord
      <span className="sr-only"> — home</span>
    </Link>
  );
}
