import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Dashboard" };
}

/** Monday 00:00 in India, as an ISO timestamp. */
function startOfWeekIST(): string {
  const now = new Date(Date.now() + 5.5 * 3600_000);
  const day = (now.getUTCDay() + 6) % 7;
  const monday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - day);
  return new Date(monday - 5.5 * 3600_000).toISOString();
}

const lines = [
  { label: "Products", types: ["demo"], href: "/admin/leads?type=demo" },
  { label: "Project services", types: ["project"], href: "/admin/leads?type=project" },
  { label: "Staff augmentation", types: ["staffing"], href: "/admin/leads?type=staffing" },
  {
    label: "General & newsletter",
    types: ["contact", "newsletter"],
    href: "/admin/leads?type=contact",
  },
];

/** FR-A1 dashboard: leads this week per business line, new applications, open jobs. */
export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [week, newApps, openJobs, recent] = await Promise.all([
    supabase.from("leads").select("form_type").gte("created_at", startOfWeekIST()),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_open", true),
    supabase
      .from("leads")
      .select("id, created_at, form_type, status, name, email, company, attachment_path")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);
  const counts = (types: string[]) =>
    (week.data ?? []).filter((lead) => types.includes(lead.form_type)).length;

  const stats = [
    ...lines.map((line) => ({
      label: `${line.label} leads this week`,
      value: counts(line.types),
      href: line.href,
    })),
    { label: "New applications", value: newApps.count ?? 0, href: "/admin/jobs" },
    { label: "Open jobs", value: openJobs.count ?? 0, href: "/admin/jobs" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="This week starts Monday, India time." />
      <ul className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="block rounded-xl p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 font-semibold">Latest leads</h2>
      <LeadsTable rows={recent.data ?? []} />
    </>
  );
}
