"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, FileText, Search } from "lucide-react";
import { postDate } from "@/lib/post-utils";
import type { BlogPost } from "@/lib/supabase/database.types";

export function AdminPostList({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const results = posts.filter(
    (post) =>
      (filter === "all" || post.status === filter) &&
      `${post.title} ${post.location ?? ""} ${post.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section className="admin-post-list">
      <div className="admin-list-tools">
        <div className="editor-tabs">
          {["all", "published", "draft", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              aria-pressed={tab === filter}
            >
              {tab === "all" ? "All stories" : tab}
              <span>
                {posts.filter((p) => tab === "all" || p.status === tab).length}
              </span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search stories</span>
          <input
            type="search"
            placeholder="Find a story…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="admin-list-header">
        <span>STORY</span>
        <span>STATUS</span>
        <span>REPORT DATE</span>
        <span />
      </div>
      {results.map((post) => (
        <Link
          className="admin-post-row"
          href={`/admin/posts/${post.id}`}
          key={post.id}
        >
          <div className="admin-post-title">
            <span className="post-type-icon">
              <FileText size={20} />
            </span>
            <div>
              <strong>{post.title}</strong>
              <span>
                {post.category}
                {post.location ? ` · ${post.location}` : ""}
              </span>
            </div>
          </div>
          <span className={`status-badge status-${post.status}`}>
            {post.status}
          </span>
          <time dateTime={post.event_date}>{postDate(post.event_date)}</time>
          <span className="admin-edit">
            Edit <ArrowUpRight size={17} />
          </span>
        </Link>
      ))}
      {!results.length && (
        <div className="empty-state">
          <FileText size={30} />
          <h2>No stories here yet.</h2>
          <p>
            {posts.length
              ? "Try a different search or status."
              : "Create your first rescue report, training update or community story."}
          </p>
        </div>
      )}
      <p className="admin-list-count" aria-live="polite">
        {results.length} {results.length === 1 ? "story" : "stories"}
      </p>
    </section>
  );
}
