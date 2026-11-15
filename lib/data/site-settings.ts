import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/types";
import { parseStringMap } from "./json";

export type SiteSettings = Omit<Tables<"site_settings">, "socials"> & {
  /** e.g. { linkedin: "https://…", x: "https://…" } */
  socials: Record<string, string>;
};

/** The single `site_settings` row (company details, socials, announcement bar). */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw new Error(`Failed to load site settings: ${error.message}`);
  return { ...data, socials: parseStringMap(data.socials) };
});
