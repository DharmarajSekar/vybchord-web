import Image from "next/image";
import { Section } from "@/components/site/section";
import { mediaUrl } from "@/lib/media";

/** FR-P3 screenshots. Fixed 16:10 frames so images never shift layout while loading. */
type GalleryProps = { name: string; screenshots: string[]; eyebrow?: string; title?: string };

export function ScreenshotGallery({ name, screenshots, eyebrow, title }: GalleryProps) {
  if (screenshots.length === 0) return null;

  return (
    <Section
      id="screenshots"
      eyebrow={eyebrow ?? "Product tour"}
      title={title ?? `See ${name} in action`}
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {screenshots.map((src, index) => (
          <li
            key={src}
            className={index === 0 && screenshots.length % 2 === 1 ? "md:col-span-2" : undefined}
          >
            <figure className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
              <Image
                src={mediaUrl(src)}
                alt={`${name} screenshot ${index + 1} of ${screenshots.length}`}
                fill
                sizes="(min-width: 1280px) 1216px, (min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
