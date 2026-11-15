"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { useUrlFilters } from "@/components/site/use-url-filters";

/** FR-A7 filter by skill (kept in the URL). */
export function BenchSearch() {
  const id = useId();
  const { values, setFilter } = useUrlFilters(["skill"] as const);
  return (
    <div className="mb-4 flex max-w-sm flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        Filter by skill
      </label>
      <Input
        id={id}
        type="search"
        placeholder="e.g. React"
        defaultValue={values.skill ?? ""}
        onChange={(e) => setFilter("skill", e.target.value || null)}
        className="h-10"
      />
    </div>
  );
}
