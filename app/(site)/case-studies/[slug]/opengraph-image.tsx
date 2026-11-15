import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getCaseStudyBySlug } from "@/lib/data/case-studies";

export const alt = "Vybchord case study";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getCaseStudyBySlug((await params).slug);
  if (!item) return renderOgImage({ title: "Vybchord case study" });
  return renderOgImage({
    eyebrow: ["Case study", item.industry].filter(Boolean).join(" · "),
    title: item.title,
    subtitle: item.outcome,
  });
}
