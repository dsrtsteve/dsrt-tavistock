import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedPost } from "@/lib/posts";
import { calloutCategories } from "@/lib/post-utils";
export const dynamic = "force-dynamic";
export default async function CalloutRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPublishedPost((await params).slug);
  if (!post || !calloutCategories.includes(post.category as (typeof calloutCategories)[number])) notFound();
  permanentRedirect(`/blog/${post.slug}`);
}
