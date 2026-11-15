"use client";

import { FilterSelect } from "@/components/site/filter-select";
import { useUrlFilters } from "@/components/site/use-url-filters";
import type { CaseStudySummary } from "@/lib/data/case-studies";
import { businessLineLabel } from "@/lib/site/labels";
import { CaseStudyGrid } from "./case-study-grid";

const lines = Object.entries(businessLineLabel).map(([value, label]) => ({ value, label }));

/** FR-P7 filters: industry and business line, kept in the URL. */
export function CaseStudyBrowser({
  studies,
  industries,
}: {
  studies: CaseStudySummary[];
  industries: string[];
}) {
  const { values, setFilter } = useUrlFilters(["industry", "line"] as const);
  const filtered = studies.filter(
    (study) =>
      (!values.industry || study.industry === values.industry) &&
      (!values.line || study.line === values.line),
  );

  return (
    <>
      <div className="mb-8 grid gap-4 sm:flex sm:flex-wrap">
        <FilterSelect
          label="Industry"
          value={values.industry}
          allLabel="All industries"
          options={industries.map((industry) => ({ value: industry, label: industry }))}
          onChange={(value) => setFilter("industry", value)}
        />
        <FilterSelect
          label="Business line"
          value={values.line}
          allLabel="All business lines"
          options={lines}
          onChange={(value) => setFilter("line", value)}
        />
      </div>
      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "case study" : "case studies"}
      </p>
      <CaseStudyGrid studies={filtered} />
    </>
  );
}
