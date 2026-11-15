"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/site/filter-select";
import { useUrlFilters } from "@/components/site/use-url-filters";
import type { JobSummary, JobType } from "@/lib/data/jobs";
import { jobTypeLabel } from "@/lib/site/labels";
import { JobList } from "./job-card";

const types = Object.entries(jobTypeLabel).map(([value, label]) => ({ value, label }));

/** FR-P9 role list filters: role (search), type and location, kept in the URL. */
export function JobBrowser({ jobs }: { jobs: JobSummary[] }) {
  const searchId = useId();
  const { values, setFilter } = useUrlFilters(["q", "type", "location"] as const);
  const locations = [
    ...new Set(jobs.map((job) => job.location).filter(Boolean) as string[]),
  ].sort();

  const query = values.q?.trim().toLowerCase();
  const filtered = jobs.filter(
    (job) =>
      (!values.type || job.type === (values.type as JobType)) &&
      (!values.location || job.location === values.location) &&
      (!query ||
        job.title.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query))),
  );

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={searchId} className="text-sm font-medium">
            Role or skill
          </label>
          <Input
            id={searchId}
            type="search"
            placeholder="e.g. React, DevOps"
            defaultValue={values.q ?? ""}
            onChange={(event) => setFilter("q", event.target.value || null)}
            className="h-10"
          />
        </div>
        <FilterSelect
          label="Type"
          value={values.type}
          allLabel="All types"
          options={types}
          onChange={(value) => setFilter("type", value)}
        />
        <FilterSelect
          label="Location"
          value={values.location}
          allLabel="All locations"
          options={locations.map((location) => ({ value: location, label: location }))}
          onChange={(value) => setFilter("location", value)}
        />
      </div>
      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
      </p>
      <JobList jobs={filtered} />
    </>
  );
}
