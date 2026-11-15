import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

type AuditEntry = {
  actor: string;
  action: string;
  entity?: string;
  entityId?: string;
  meta?: Record<string, Json | undefined>;
};

/**
 * FR-A9 audit log. Written with the service role because RLS only lets admins read the log,
 * so nobody can edit or delete entries from the browser. Never throws.
 */
export async function logAdminAction({ actor, action, entity, entityId, meta }: AuditEntry) {
  const { error } = await createAdminClient()
    .from("admin_audit_log")
    .insert({
      actor,
      action,
      entity: entity ?? null,
      entity_id: entityId ?? null,
      meta: meta ?? {},
    });
  if (error) console.error("[audit] write failed", action, error.message);
}
