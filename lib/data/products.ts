import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/types";
import { parseStringRecords } from "./json";

type ProductRow = Tables<"products">;

export type ProductModule = { title: string; description: string };
export type ProductFaq = { question: string; answer: string };

export type Product = Omit<
  ProductRow,
  "modules" | "faqs" | "screenshots" | "deployment_options" | "security_notes"
> & {
  modules: ProductModule[];
  faqs: ProductFaq[];
  screenshots: string[];
  deployment_options: string[];
  security_notes: string[];
};

export type ProductSummary = Pick<
  Product,
  "id" | "slug" | "name" | "tagline" | "summary" | "domain" | "status"
>;

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    modules: parseStringRecords(row.modules, ["title", "description"]),
    faqs: parseStringRecords(row.faqs, ["question", "answer"]),
    screenshots: row.screenshots ?? [],
    deployment_options: row.deployment_options ?? [],
    security_notes: row.security_notes ?? [],
  };
}

/** Published products for listings and the home showcase, in display order. */
export const getProducts = cache(async (): Promise<ProductSummary[]> => {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, tagline, summary, domain, status")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return data;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product "${slug}": ${error.message}`);
  return data ? toProduct(data) : null;
});

export async function getProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((product) => product.slug);
}
