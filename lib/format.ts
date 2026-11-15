const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
}

/** Markdown/MDX → plain text: drops code fences, tags, link targets and formatting marks. */
export function mdxToText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>~]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** FR-P10 reading time at 200 words per minute, minimum one minute. */
export function readingMinutes(source: string): number {
  const words = mdxToText(source).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
