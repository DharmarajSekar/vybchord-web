import { Badge } from "@/components/ui/badge";
import { CaseStudyCard } from "@/components/site/case-study-card";
import { CheckList } from "@/components/site/info-cards";
import { ProcessSteps } from "@/components/site/process-steps";
import { Section } from "@/components/site/section";
import type { Service } from "@/content/services";
import type { CaseStudySummary } from "@/lib/data/case-studies";

/** FR-P5 scope and deliverables side by side. */
export function ScopeAndDeliverables({ service }: { service: Service }) {
  return (
    <Section id="scope" eyebrow="What's included" title="Scope and deliverables">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">What we do</h3>
          <CheckList items={service.scope} />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">What you get</h3>
          <CheckList items={service.deliverables} />
        </div>
      </div>
    </Section>
  );
}

/** FR-P5 typical timeline. */
export function ServiceTimeline({ service }: { service: Service }) {
  return (
    <Section
      id="timeline"
      eyebrow="Typical timeline"
      title={service.timeline.total}
      description="Every project is scoped individually. This is a typical plan, confirmed after discovery."
      className="bg-muted/40"
    >
      <ProcessSteps
        steps={service.timeline.phases.map((phase) => ({
          title: phase.name,
          when: phase.duration,
        }))}
      />
    </Section>
  );
}

/** FR-P5 stack. */
export function TechStack({ stack }: { stack: string[] }) {
  return (
    <Section id="stack" eyebrow="Stack" title="Technology we use">
      <ul className="flex flex-wrap gap-2" aria-label="Technologies">
        {stack.map((item) => (
          <li key={item}>
            <Badge variant="outline" className="h-8 px-3 text-sm">
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** FR-P5 related case studies; hidden until project case studies are published. */
export function RelatedCaseStudies({ studies }: { studies: CaseStudySummary[] }) {
  if (studies.length === 0) return null;

  return (
    <Section id="case-studies" eyebrow="Case studies" title="Related work" className="bg-muted/40">
      <ul className="grid gap-6 md:grid-cols-3">
        {studies.map((study) => (
          <li key={study.id}>
            <CaseStudyCard study={study} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
