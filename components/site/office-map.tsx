/** Lazy-loaded Google Maps embed for the registered office address. */
export function OfficeMap({ address, className }: { address: string; className?: string }) {
  return (
    <iframe
      title="Office location map"
      src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`aspect-[4/3] w-full rounded-xl border-0 bg-muted ${className ?? ""}`}
    />
  );
}
