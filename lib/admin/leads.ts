import "server-only";
import type { Admin } from "./auth";
import { Constants, type Enums } from "@/lib/supabase/types";

export type LeadFilters = {
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  q?: string;
};

export function readLeadFilters(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): LeadFilters {
  const get = (key: string) => {
    const value = params instanceof URLSearchParams ? params.get(key) : params[key];
    return typeof value === "string" && value ? value : undefined;
  };
  return {
    type: get("type"),
    status: get("status"),
    from: get("from"),
    to: get("to"),
    q: get("q"),
  };
}

const isDate = (value?: string) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

/** FR-A2 lead list with filters (type, status, date range, search). Newest first, capped at 1,000. */
export async function fetchLeads({ supabase }: Admin, filters: LeadFilters) {
  let query = supabase
    .from("leads")
    .select(
      "id, created_at, form_type, status, name, email, phone, company, payload, source_page, utm, attachment_path",
    )
    .order("created_at", { ascending: false })
    .limit(1000);

  if (Constants.public.Enums.lead_form_type.includes(filters.type as Enums<"lead_form_type">)) {
    query = query.eq("form_type", filters.type as Enums<"lead_form_type">);
  }
  if (Constants.public.Enums.lead_status.includes(filters.status as Enums<"lead_status">)) {
    query = query.eq("status", filters.status as Enums<"lead_status">);
  }
  if (isDate(filters.from)) query = query.gte("created_at", `${filters.from}T00:00:00+05:30`);
  if (isDate(filters.to)) query = query.lte("created_at", `${filters.to}T23:59:59.999+05:30`);
  // Strip characters that have meaning in PostgREST filter syntax.
  const q = filters.q
    ?.replace(/[,()*%\\]/g, " ")
    .trim()
    .slice(0, 80);
  if (q) query = query.or(`name.ilike.*${q}*,email.ilike.*${q}*,company.ilike.*${q}*`);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load leads: ${error.message}`);
  return data;
}

export type LeadRow = Awaited<ReturnType<typeof fetchLeads>>[number];
