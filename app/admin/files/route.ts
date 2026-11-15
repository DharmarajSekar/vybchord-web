import { NextResponse, type NextRequest } from "next/server";
import { logAdminAction } from "@/lib/admin/audit";
import { getAdmin } from "@/lib/admin/auth";

// Only paths produced by lib/forms/uploads.ts: leads/YYYY-MM/<uuid>.<ext> or cvs/…
const UPLOAD_PATH = /^(leads|cvs)\/\d{4}-\d{2}\/[0-9a-f-]{36}\.(pdf|doc|docx)$/;

/**
 * FRD §4 rule 4: private uploads are only reachable by admins, through a signed URL that expires
 * after 60 seconds. The storage policy also requires is_admin().
 */
export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return new Response("Not found", { status: 404 });

  const path = request.nextUrl.searchParams.get("path") ?? "";
  if (!UPLOAD_PATH.test(path)) return new Response("Invalid file", { status: 400 });

  const { data, error } = await admin.supabase.storage.from("uploads").createSignedUrl(path, 60);
  if (error || !data) {
    console.error("[admin] signed URL failed", error?.message);
    return new Response("File not available", { status: 404 });
  }
  await logAdminAction({
    actor: admin.user.id,
    action: "file.download",
    entity: "upload",
    meta: { path },
  });
  return NextResponse.redirect(data.signedUrl);
}
