import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, MapPin, Radio } from "lucide-react";
import { BlogShare } from "./blog-share";
import { PostBody } from "./post-body";
import { Eyebrow, SupportBanner } from "./site";
import { mediaUrl, postDate, readingMinutes } from "@/lib/post-utils";
import type { BlogPost } from "@/lib/supabase/database.types";

export function PostArticle({ post }: { post: BlogPost }) {
  return (
    <>
      <header className="post-header">
        <div className="site-container">
          <Link href="/blog" className="admin-back">
            <ArrowLeft size={15} /> Back to the journal
          </Link>
          <div className="post-header-grid">
            <div>
              <Eyebrow>
                {post.category === "Rescue"
                  ? "FROM THE CALL-OUT LOG"
                  : post.category}
              </Eyebrow>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="post-byline">
                <Image
                  src="/images/dsrt-tavistock-official.png"
                  alt=""
                  width={38}
                  height={44}
                />
                <div>
                  <strong>DSRT Tavistock</strong>
                  <span>
                    <time dateTime={post.event_date}>
                      {postDate(post.event_date)}
                    </time>
                    <span aria-hidden="true"> · </span>
                    <Clock3 size={13} />
                    {readingMinutes(post.body)} min read
                  </span>
                </div>
              </div>
            </div>
            <div className="post-issue">
              <Radio size={31} strokeWidth={1.2} />
              <span>{post.incident_number ? "CALL-OUT" : "TEAM JOURNAL"}</span>
              <strong>
                {post.incident_number
                  ? String(post.incident_number).padStart(3, "0")
                  : new Date(post.event_date).getUTCFullYear()}
              </strong>
              <span>VOLUNTEERS. ALWAYS READY.</span>
            </div>
          </div>
        </div>
      </header>
      <article className="site-container post-layout">
        <div className="post-content">
          {post.cover_path && (
            <figure className="post-cover">
              <Image
                unoptimized
                width={1600}
                height={1067}
                src={mediaUrl(post.cover_path)}
                alt={post.cover_alt ?? ""}
              />
              {post.cover_caption && (
                <figcaption>{post.cover_caption}</figcaption>
              )}
            </figure>
          )}
          {(post.location || post.rescue_type) && (
            <div className="post-facts">
              {post.location && (
                <span>
                  <MapPin size={17} />
                  {post.location}
                </span>
              )}
              {post.rescue_type && <span>{post.rescue_type}</span>}
            </div>
          )}
          <PostBody body={post.body} />
          {post.source_url && (
            <p className="post-source">
              Based on the team’s published report.{" "}
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the original <ArrowUpRight size={13} />
              </a>
            </p>
          )}
          <BlogShare title={post.title} />
          <Link href="/blog" className="text-link">
            <ArrowLeft size={17} /> More from the team
          </Link>
        </div>
        <aside className="post-aside">
          <div className="post-support-card">
            <span className="eyebrow">HELP US BE THERE</span>
            <h2>
              Our time is free. <br />
              Your support is <br />
              priceless.
            </h2>
            <p>
              Every donation helps equip and train the volunteers behind these
              stories.
            </p>
            <Link href="/support-us/donate" className="button button-red">
              Support the team <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="post-emergency">
            <Radio size={19} />
            <div>
              <strong>Need help on the moor?</strong>
              <p>
                Call 999. Ask for Police,
                <br />
                then Mountain Rescue.
              </p>
            </div>
          </div>
        </aside>
      </article>
      <SupportBanner />
    </>
  );
}
