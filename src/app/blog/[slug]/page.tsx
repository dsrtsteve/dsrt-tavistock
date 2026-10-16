import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPost } from "@/lib/posts";
import { PostArticle } from "@/components/post-article";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Story not found" };
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL(`/blog/${post.slug}`, origin).href;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      siteName: "DSRT Tavistock",
      locale: "en_GB",
      images: [
        {
          url: new URL(
            post.cover_path
              ? `/media/${post.cover_path}`
              : "/images/dsrt-tavistock-official.png",
            origin,
          ).href,
          alt: post.cover_alt ?? "DSRT Tavistock",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}
export default async function BlogPostPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  return <PostArticle post={post} />;
}
