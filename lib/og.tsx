import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Logo with light lettering (for the navy card) embedded as a data URL so no network fetch is needed.
const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/logo-dark.png")).toString("base64")}`;

type OgCard = { eyebrow?: string | null; title: string; subtitle?: string | null };

/** NFR-2 Open Graph / Twitter card image: brand logo, eyebrow, title and subtitle. */
export function renderOgImage({ eyebrow, title, subtitle }: OgCard) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #000d4b 0%, #0a0f2e 55%, #1a0640 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 700 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logo} width={279} height={72} alt="Vybchord" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            width: 160,
            height: 6,
            borderRadius: 3,
            background: "linear-gradient(90deg, #6702db, #0038f3, #00e1f0)",
          }}
        />
        {eyebrow && <div style={{ fontSize: 28, color: "#8fb0ff" }}>{eyebrow}</div>}
        <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 30, color: "#d6dcf5", lineHeight: 1.3 }}>
            {subtitle.length > 120 ? `${subtitle.slice(0, 117)}…` : subtitle}
          </div>
        )}
      </div>
    </div>,
    ogSize,
  );
}
