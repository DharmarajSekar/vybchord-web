import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Public pages are ISR (hourly). After an admin edit, refresh the whole public site and the
 * sitemap at once, so changes appear on the next visit instead of within the hour.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
