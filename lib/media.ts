/**
 * Resolves a media reference stored in the database to a URL.
 * Absolute URLs pass through; anything else is treated as a path in the public `media` bucket.
 */
export function mediaUrl(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/storage/v1/object/public/media/${value.replace(/^\/+/, "")}`;
}
