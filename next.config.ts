import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

function supabaseOrigins(): string[] {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return ["https://*.supabase.co", "wss://*.supabase.co"];
  const { host } = new URL(raw);
  return [`https://${host}`, `wss://${host}`];
}

const supabase = supabaseOrigins();
const turnstile = "https://challenges.cloudflare.com";
const ga = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
];
const clarity = ["https://*.clarity.ms", "https://c.bing.com"];
const cal = ["https://cal.com", "https://app.cal.com", "https://*.cal.com"];

const csp = [
  "default-src 'self'",
  // Next.js inlines bootstrap scripts on statically rendered pages, so nonces are not usable here.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${turnstile} ${ga.join(" ")} ${clarity.join(" ")} ${cal.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabase[0]} ${ga.join(" ")} ${clarity.join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabase.join(" ")} ${turnstile} ${ga.join(" ")} ${clarity.join(" ")} ${cal.join(" ")}`,
  `frame-src ${turnstile} ${cal.join(" ")}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
