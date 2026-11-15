"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminResult } from "@/lib/admin/result";

type EraseButtonProps = {
  id: string;
  name: string;
  what: string;
  action: (input: { id: string }) => Promise<AdminResult>;
  /** Where to go afterwards; omit to stay and refresh (e.g. table rows). */
  redirectTo?: string;
  compact?: boolean;
};

/** NFR-6 erasure on request: permanently deletes a person's data after confirmation. */
export function EraseButton({ id, name, what, action, redirectTo, compact }: EraseButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      const result = await action({ id });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message ?? "Deleted");
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={compact ? "ghost" : "destructive"}
            size={compact ? "icon-sm" : "default"}
            aria-label={compact ? `Delete ${name}'s data` : undefined}
          />
        }
      >
        <Trash2Icon aria-hidden />
        {!compact && "Delete data"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete all data for {name}?</DialogTitle>
          <DialogDescription>
            This permanently deletes the {what}. Use it for erasure requests under the DPDP Act. It
            cannot be undone; the audit log records that it happened, without personal details.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" onClick={confirm} disabled={pending}>
            {pending ? "Deleting…" : "Delete permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
