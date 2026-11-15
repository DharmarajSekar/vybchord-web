import { SiteShell } from "@/components/site/site-shell";

// Static with hourly ISR; admin settings edits should also call revalidatePath("/", "layout").
export const revalidate = 3600;

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
