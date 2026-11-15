/** Cal.com booking URL from NEXT_PUBLIC_CAL_LINK ("team/intro-call" or a full URL), or null. */
export function bookingUrl(): string | null {
  const link = process.env.NEXT_PUBLIC_CAL_LINK?.trim();
  if (!link) return null;
  return /^https?:\/\//.test(link) ? link : `https://cal.com/${link.replace(/^\/+/, "")}`;
}
