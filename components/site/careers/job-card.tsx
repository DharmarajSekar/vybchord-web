import Link from "next/link";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobSummary } from "@/lib/data/jobs";
import { jobTypeLabel } from "@/lib/site/labels";

export function JobCard({ job }: { job: JobSummary }) {
  const place = [job.location, job.work_mode].filter(Boolean).join(" · ");
  return (
    <article className="relative flex flex-col gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          <Link
            href={`/careers/${job.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {job.title}
          </Link>
        </h3>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {place && (
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-4" aria-hidden />
              {place}
            </span>
          )}
          {job.experience && (
            <span className="inline-flex items-center gap-1">
              <BriefcaseIcon className="size-4" aria-hidden />
              {job.experience}
            </span>
          )}
        </p>
      </div>
      <Badge variant="secondary" className="self-start sm:self-center">
        {jobTypeLabel[job.type]}
      </Badge>
    </article>
  );
}

export function JobList({ jobs }: { jobs: JobSummary[] }) {
  if (jobs.length === 0) {
    return <p className="text-muted-foreground">No open roles match these filters.</p>;
  }
  return (
    <ul className="space-y-4">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}
