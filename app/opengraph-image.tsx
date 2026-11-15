import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Vybchord — AI-native software, production-ready from day one";
export const size = ogSize;
export const contentType = ogContentType;

/** Default share image for every page without its own. */
export default function Image() {
  return renderOgImage({
    eyebrow: "Products · Project services · Engineering teams",
    title: "AI-native software, production-ready from day one",
  });
}
