"use client";

import { DownloadIcon, ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { runRetentionNow } from "@/lib/admin/actions/privacy";

/** Dashboard card: NFR-6 retention (run now) and NFR-11 backup export. */
export function DataProtectionCard({ expiredApplications }: { expiredApplications: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const result = await runRetentionNow();
      if (result.ok) {
        toast.success(result.message ?? "Done");
        router.refresh();
      } else toast.error(result.message);
    });

  return (
    <section
      aria-labelledby="data-title"
      className="mb-10 rounded-xl p-5 ring-1 ring-foreground/10"
    >
      <h2 id="data-title" className="flex items-center gap-2 font-semibold">
        <ShieldCheckIcon className="size-4" aria-hidden />
        Data protection
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        CVs are kept for 12 months (Privacy Policy). {expiredApplications} application
        {expiredApplications === 1 ? " is" : "s are"} past that and will be deleted by the next
        retention run, along with unconfirmed newsletter sign-ups older than 30 days and old
        spam-protection records. Schedule it daily with the cron endpoint; you can also run it here.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={run} disabled={pending}>
          {pending ? "Running…" : "Run retention now"}
        </Button>
        <a href="/admin/export" className={buttonVariants({ variant: "ghost" })}>
          <DownloadIcon aria-hidden />
          Download backup (JSON)
        </a>
      </div>
    </section>
  );
}
