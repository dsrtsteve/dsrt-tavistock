import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedPost } from "@/lib/posts";
export const dynamic = "force-dynamic";
export default async function CalloutRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPublishedPost((await params).slug);
  if (!post || post.category !== "Rescue") notFound();
  permanentRedirect(`/blog/${post.slug}`);
}
