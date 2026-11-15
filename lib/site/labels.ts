import type { Enums } from "@/lib/supabase/types";

export const businessLineLabel: Record<Enums<"business_line">, string> = {
  products: "Products",
  services: "Project services",
  staffing: "Staff augmentation",
};

export const jobTypeLabel: Record<Enums<"job_type">, string> = {
  full_time: "Full-time",
  contract: "Contract",
  deployment: "Client deployment",
};
