"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/site/filter-select";
import { useUrlFilters } from "@/components/site/use-url-filters";
import { formTypeLabel, leadStatusLabel, toOptions } from "@/lib/admin/labels";

/** FR-A2 filters: type, status, date range and search, kept in the URL (and used by CSV export). */
export function LeadFilters() {
  const id = useId();
  const { values, setFilter } = useUrlFilters(["type", "status", "from", "to", "q"] as const);

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="flex flex-col gap-1.5 lg:col-span-1">
        <label htmlFor={`${id}-q`} className="text-sm font-medium">
          Search
        </label>
        <Input
          id={`${id}-q`}
          type="search"
          placeholder="Name, email or company"
          defaultValue={values.q ?? ""}
          onChange={(e) => setFilter("q", e.target.value || null)}
          className="h-10"
        />
      </div>
      <FilterSelect
        label="Type"
        value={values.type}
        allLabel="All types"
        options={toOptions(formTypeLabel)}
        onChange={(v) => setFilter("type", v)}
      />
      <FilterSelect
        label="Status"
        value={values.status}
        allLabel="All statuses"
        options={toOptions(leadStatusLabel)}
        onChange={(v) => setFilter("status", v)}
      />
      {(["from", "to"] as const).map((key) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-${key}`} className="text-sm font-medium">
            {key === "from" ? "From" : "To"}
          </label>
          <Input
            id={`${id}-${key}`}
            type="date"
            defaultValue={values[key] ?? ""}
            onChange={(e) => setFilter(key, e.target.value || null)}
            className="h-10"
          />
        </div>
      ))}
    </div>
  );
}
