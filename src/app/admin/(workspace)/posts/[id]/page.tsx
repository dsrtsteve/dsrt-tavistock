import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("We couldn’t open this post. Please try again.");
  if (!data) notFound();
  return (
    <PostEditor
      key={data.id}
      post={data}
      justSaved={(await searchParams).saved === "1"}
    />
  );
}
