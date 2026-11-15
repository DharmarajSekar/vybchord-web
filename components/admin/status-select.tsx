"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminResult } from "@/lib/admin/result";

type StatusSelectProps = {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  action: (input: { id: string; status: string }) => Promise<AdminResult>;
  label: string;
};

/** Inline status change for leads and applications; saves immediately. */
export function StatusSelect({ id, value, options, action, label }: StatusSelectProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();

  const change = (next: string | null) => {
    if (!next || next === current) return;
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const result = await action({ id, status: next });
      if (result.ok) {
        toast.success(result.message ?? "Updated");
        router.refresh();
      } else {
        setCurrent(previous);
        toast.error(result.message);
      }
    });
  };

  return (
    <Select items={options} value={current} onValueChange={change} disabled={pending}>
      <SelectTrigger aria-label={label} className="h-8 min-w-32" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
