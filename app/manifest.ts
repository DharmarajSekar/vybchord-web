import type { MetadataRoute } from "next";

/** Home-screen icon and colours when the site is saved to a phone. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vybchord",
    short_name: "Vybchord",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0038f3",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
