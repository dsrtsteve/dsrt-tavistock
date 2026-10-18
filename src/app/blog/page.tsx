import { BlogBrowser } from "@/components/blog-browser";
import { PageIntro, SupportBanner } from "@/components/site";
import { getPublishedJournalPosts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "The team journal",
  description:
    "Training, community, team news and fundraising from the team.",
};

export default async function BlogPage() {
  const posts = await getPublishedJournalPosts();
  return (
    <>
      <PageIntro
        eyebrow="THE TEAM JOURNAL"
        title={"Out on the moor.\nBehind the scenes."}
        description="Training, community, team news and fundraising from the people behind the call-outs."
      />
      <section className="site-container section-space journal-section">
        <BlogBrowser posts={posts} />
      </section>
      <SupportBanner />
    </>
  );
}
