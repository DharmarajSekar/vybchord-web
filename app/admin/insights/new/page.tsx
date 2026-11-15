import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostForm, emptyPost } from "@/components/admin/forms/post-form";
import { requireAdmin } from "@/lib/admin/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "New article" };
}

export default async function NewPostPage() {
  await requireAdmin("/admin/insights/new");
  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/insights", label: "All articles" }}
        title="New article"
      />
      <PostForm id={null} values={emptyPost} />
    </>
  );
}
