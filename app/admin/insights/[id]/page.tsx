import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { PostForm } from "@/components/admin/forms/post-form";
import { requireAdmin } from "@/lib/admin/auth";
import { postToForm } from "@/lib/admin/mappers";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit article" };
}

export default async function EditPostPage({ params }: PageProps<"/admin/insights/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/insights/${id}`);
  const { data: row } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  const values = postToForm(row);
  const title = values.title;

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/insights", label: "All articles" }}
        title={title}
        actions={<DeleteButton table="posts" id={row.id} name={title} listHref="/admin/insights" />}
      />
      <PostForm id={row.id} values={values} />
    </>
  );
}
