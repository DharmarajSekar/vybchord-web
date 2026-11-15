import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getJobBySlug } from "@/lib/data/jobs";

export const alt = "Open role at Vybchord";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getJobBySlug((await params).slug);
  if (!item) return renderOgImage({ title: "Open role at Vybchord" });
  return renderOgImage({
    eyebrow: "We are hiring",
    title: item.title,
    subtitle: [item.location, item.work_mode, item.experience].filter(Boolean).join(" · "),
  });
}
