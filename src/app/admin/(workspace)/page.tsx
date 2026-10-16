import Link from "next/link";
import { FileText, Globe2, NotebookPen, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminPostList } from "@/components/admin/post-list";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error)
    throw new Error(
      "Your stories could not be loaded. Please try again shortly.",
    );
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">THE TEAM JOURNAL</span>
          <h1>Stories from the team.</h1>
          <p>Rescues, training and the people who make it possible.</p>
        </div>
        <Link href="/admin/posts/new" className="button button-red">
          <Plus size={18} /> New story
        </Link>
      </div>
      <div className="dashboard-stats">
        {[
          { label: "All stories", count: posts.length, Icon: FileText },
          {
            label: "Published",
            count: posts.filter((p) => p.status === "published").length,
            Icon: Globe2,
          },
          {
            label: "Drafts",
            count: posts.filter((p) => p.status === "draft").length,
            Icon: NotebookPen,
          },
        ].map(({ label, count, Icon }) => (
          <div key={label}>
            <span>
              <Icon size={20} />
              {label}
            </span>
            <strong>{String(count).padStart(2, "0")}</strong>
          </div>
        ))}
      </div>
      <AdminPostList posts={posts} />
    </>
  );
}
