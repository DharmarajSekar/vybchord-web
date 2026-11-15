/** Optional site-wide notice managed from admin settings (FR-A8). */
export function AnnouncementBar({ message }: { message: string | null | undefined }) {
  if (!message?.trim()) return null;

  return (
    <div className="bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      <p className="mx-auto max-w-7xl">{message}</p>
    </div>
  );
}
