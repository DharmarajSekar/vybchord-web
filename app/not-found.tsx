import type { Metadata } from "next";
import { NotFoundContent } from "@/components/site/not-found-content";
import { SiteShell } from "@/components/site/site-shell";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Page not found" };
}

/** Unmatched URLs render outside the (site) layout, so the site chrome is added here. */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
