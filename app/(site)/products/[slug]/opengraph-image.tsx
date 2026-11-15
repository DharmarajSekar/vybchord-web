import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getProductBySlug } from "@/lib/data/products";

export const alt = "Vybchord product";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getProductBySlug((await params).slug);
  if (!item) return renderOgImage({ title: "Vybchord product" });
  return renderOgImage({
    eyebrow: item.domain ?? "Product",
    title: item.name,
    subtitle: item.tagline,
  });
}
