"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/database.types";
import { calloutCategories, mediaUrl, postDate } from "@/lib/post-utils";

export function CalloutBrowser({ posts }: { posts: BlogPost[] }) {
  const filters = ["All call-outs", ...calloutCategories];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All call-outs");
  const results = posts.filter(
    (item) =>
      (category === "All call-outs" || item.category === category) &&
      `${item.title} ${item.location ?? ""} ${item.excerpt} ${item.incident_number ?? ""} ${postDate(item.event_date)}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const currentYear = new Date().getFullYear();
  const years = [
    ...new Set(results.map((post) => post.event_date.slice(0, 4))),
  ].sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <div className="filters">
        <div className="search-field">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="callout-search" className="sr-only">
            Search call-outs by location or keyword
          </label>
          <input
            id="callout-search"
            type="search"
            placeholder="Search a location or keyword…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-buttons" aria-label="Filter call-outs by type">
          {filters.map((filter) => (
            <button
              key={filter}
              aria-pressed={category === filter}
              onClick={() => setCategory(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {results.length} {results.length === 1 ? "report" : "reports"}
      </p>
      {results.length ? (
        years.map((year) => {
          const yearPosts = results.filter((post) => post.event_date.startsWith(year));
          const list = (
            <div className="callout-list">
              {yearPosts.map((item) => (
                <Link
                  className="callout-row"
                  href={`/blog/${item.slug}`}
                  key={item.id}
                >
                  <div className="callout-date">
                    <time dateTime={item.event_date}>
                      {postDate(item.event_date)}
                    </time>
                    <span>
                      {item.incident_number
                        ? `INCIDENT ${item.incident_number}`
                        : "RESCUE REPORT"}
                    </span>
                  </div>
                  <span className="callout-thumbnail">
                    {item.cover_path ? (
                      <Image
                        unoptimized
                        src={mediaUrl(item.cover_path)}
                        alt={item.cover_alt ?? ""}
                        fill
                        sizes="(max-width: 767px) 56px, 112px"
                      />
                    ) : (
                      <>
                        <Image
                          src="/images/dartmoor-rescue-hero.webp"
                          alt=""
                          fill
                          sizes="(max-width: 767px) 56px, 112px"
                        />
                        <span>Illustration</span>
                      </>
                    )}
                  </span>
                  <div className="callout-row-content">
                    <span className="callout-category">
                      {item.category}
                    </span>
                    <h3>{item.title}</h3>
                    <span className="callout-place">
                      <MapPin size={13} />
                      {item.location}
                    </span>
                  </div>
                  <span className="callout-read">
                    Read report <ArrowUpRight size={20} />
                  </span>
                </Link>
              ))}
            </div>
          );

          return Number(year) === currentYear ? (
            <section
              className="archive-year"
              key={year}
              aria-labelledby={`callouts-${year}`}
            >
              <h2 className="archive-year-title" id={`callouts-${year}`}>
                {year} call-outs
              </h2>
              {list}
            </section>
          ) : (
            <details
              className="archive-year archive-year-details"
              key={year}
              open={!!query || category !== "All call-outs"}
            >
              <summary>
                {year} call-outs
                <span>
                  {yearPosts.length} {yearPosts.length === 1 ? "report" : "reports"}
                </span>
              </summary>
              {list}
            </details>
          );
        })
      ) : (
        <div className="empty-state">
          <h2>No matching call-outs</h2>
          <p>
            Try another place or keyword, or clear the filters to see every
            report.
          </p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setCategory("All call-outs");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <p className="archive-note">
        Reports published by the team. Visit the{" "}
        <a
          href="https://dsrt-tavistock.org.uk/call-outs/"
          target="_blank"
          rel="noreferrer"
        >
          original call-out archive
        </a>{" "}
        for the complete record and any subsequent updates.
      </p>
    </>
  );
}
