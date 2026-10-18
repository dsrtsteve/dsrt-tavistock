import { CalloutBrowser } from "@/components/callout-browser";
import { PageIntro, SupportBanner } from "@/components/site";
import { getPublishedCallouts } from "@/lib/posts";
export const dynamic = "force-dynamic";
export const metadata = { title: "Call-outs" };
export default async function CalloutsPage() {
  const posts = await getPublishedCallouts();
  return (
    <>
      <PageIntro
        eyebrow="Call-outs"
        title="When it matters most."
        description="Behind every call-out is someone who needs help — and a team of volunteers ready to go. Read recent published reports from the moor."
      />
      <section className="site-container section-space">
        <CalloutBrowser posts={posts} />
      </section>
      <SupportBanner />
    </>
  );
}
