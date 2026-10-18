"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Clock3, Search } from "lucide-react";
import {
  journalCategories,
  mediaUrl,
  postDate,
  readingMinutes,
} from "@/lib/post-utils";
import type { BlogPost } from "@/lib/supabase/database.types";

export function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("All stories");
  const [query, setQuery] = useState("");
  const results = posts.filter(
    (p) =>
      (category === "All stories" || p.category === category) &&
      `${p.title} ${p.excerpt} ${p.location ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const currentYear = new Date().getFullYear();
  const years = [...new Set(results.map((post) => post.event_date.slice(0, 4)))].sort(
    (a, b) => Number(b) - Number(a),
  );

  const renderStories = (year: string) => {
    const yearPosts = results.filter((post) => post.event_date.startsWith(year));
    return (
      <div className="journal-grid">
        {yearPosts.map((post, index) => (
          <article
            key={post.id}
            className={`journal-card ${Number(year) === currentYear && index === 0 && !query && category === "All stories" ? "journal-featured" : ""}`}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="journal-card-image"
              aria-label={`Read ${post.title}`}
            >
              {post.cover_path ? (
                <Image
                  unoptimized
                  width={1600}
                  height={1067}
                  src={mediaUrl(post.cover_path)}
                  alt={post.cover_alt ?? ""}
                />
              ) : (
                <Image
                  src={index % 2 === 0 ? "/images/dartmoor-rescue-hero.webp" : "/images/team-training.webp"}
                  alt="Illustration of rescue volunteers on Dartmoor, generated with AI"
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              )}
              <span className="journal-category">{post.category}</span>
              {!post.cover_path && <span className="journal-image-credit">AI-generated illustration</span>}
            </Link>
            <div className="journal-card-copy">
              <div className="journal-meta">
                <time dateTime={post.event_date}>{postDate(post.event_date)}</time>
                <span><Clock3 size={13} />{readingMinutes(post.body)} min read</span>
              </div>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-link">Read the story <ArrowUpRight size={18} /></Link>
            </div>
          </article>
        ))}
      </div>
    );
  };
  return (
    <>
      <div className="journal-tools">
        <div className="filter-buttons" aria-label="Filter stories by category">
          {["All stories", ...journalCategories].map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search the journal</span>
          <input
            type="search"
            placeholder="Search stories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {results.length} {results.length === 1 ? "story" : "stories"} from the
        team
      </p>
      {years.map((year) => {
        const yearPosts = results.filter((post) => post.event_date.startsWith(year));
        return Number(year) === currentYear ? (
          <section className="archive-year" key={year} aria-labelledby={`journal-${year}`}>
            <h2 className="archive-year-title" id={`journal-${year}`}>{year} journal</h2>
            {renderStories(year)}
          </section>
        ) : (
          <details className="archive-year archive-year-details" key={year} open={!!query || category !== "All stories"}>
            <summary>{year} journal <span>{yearPosts.length} {yearPosts.length === 1 ? "story" : "stories"}</span></summary>
            {renderStories(year)}
          </details>
        );
      })}
      {!results.length && (
        <div className="empty-state">
          <h2>
            {posts.length
              ? "No stories found."
              : "Our next chapter is on its way."}
          </h2>
          <p>
            {posts.length
              ? "Try another keyword or category."
              : "Visit again for the latest from the team."}
          </p>
          {posts.length > 0 && (
            <button
              className="button button-outline"
              onClick={() => {
                setCategory("All stories");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
