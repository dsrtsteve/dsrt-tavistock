import { BlogBrowser } from "@/components/blog-browser";
import { PageIntro, SupportBanner } from "@/components/site";
import { getPublishedPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "The team journal",
  description:
    "Stories from Dartmoor: rescue reports, volunteer training and our community.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageIntro
        eyebrow="THE TEAM JOURNAL"
        title={"Out on the moor.\nBehind the scenes."}
        description="The call-outs. The commitment. The community. Stories from the people who are there when it matters."
      />
      <section className="site-container section-space journal-section">
        <BlogBrowser posts={posts} />
      </section>
      <SupportBanner />
    </>
  );
}
