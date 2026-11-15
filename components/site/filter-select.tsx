"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all";

type FilterSelectProps = {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  allLabel: string;
  onChange: (value: string | null) => void;
};

/** Labelled list filter with an "All …" option. */
export function FilterSelect({ label, value, options, allLabel, onChange }: FilterSelectProps) {
  const id = useId();
  const items = [{ value: ALL, label: allLabel }, ...options];
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Select
        items={items}
        value={value ?? ALL}
        onValueChange={(next) => onChange(next && next !== ALL ? next : null)}
      >
        <SelectTrigger id={id} className="h-10 w-full min-w-48 data-[size=default]:h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
