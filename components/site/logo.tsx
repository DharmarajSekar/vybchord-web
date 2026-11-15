import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoDark from "@/public/brand/logo-dark.png";
import logoFooterDark from "@/public/brand/logo-footer-dark.png";
import logoFooter from "@/public/brand/logo-footer.png";
import logo from "@/public/brand/logo.png";

const variants = {
  // Mark + wordmark; the tagline is too small to read at header size.
  header: { light: logo, dark: logoDark, className: "h-9 sm:h-11", sizes: "180px" },
  // Full lock-up with "Innovate · Integrate · Elevate".
  footer: { light: logoFooter, dark: logoFooterDark, className: "h-20 sm:h-24", sizes: "370px" },
};

/** Brand logo linking home. Swaps to the light-lettered version in dark mode. */
export function Logo({
  variant = "header",
  className,
}: {
  variant?: keyof typeof variants;
  className?: string;
}) {
  const v = variants[variant];
  const img = cn("w-auto max-w-full", v.className);

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src={v.light}
        alt="Vybchord — home"
        sizes={v.sizes}
        loading="eager"
        className={cn(img, "dark:hidden")}
      />
      <Image
        src={v.dark}
        alt="Vybchord — home"
        sizes={v.sizes}
        loading="eager"
        className={cn(img, "hidden dark:block")}
      />
    </Link>
  );
}
