import { CaseStudyCard } from "@/components/site/case-study-card";
import type { CaseStudySummary } from "@/lib/data/case-studies";

export function CaseStudyGrid({ studies }: { studies: CaseStudySummary[] }) {
  if (studies.length === 0) {
    return <p className="text-muted-foreground">No case studies match these filters yet.</p>;
  }
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {studies.map((study) => (
        <li key={study.id}>
          <CaseStudyCard study={study} />
        </li>
      ))}
    </ul>
  );
}
