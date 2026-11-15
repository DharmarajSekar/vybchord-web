import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getPostBySlug } from "@/lib/data/posts";

export const alt = "Vybchord insights article";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPostBySlug((await params).slug);
  if (!item) return renderOgImage({ title: "Vybchord insights article" });
  return renderOgImage({
    eyebrow: item.category ?? "Insights",
    title: item.title,
    subtitle: item.excerpt,
  });
}
