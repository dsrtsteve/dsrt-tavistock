import "server-only";
import { cache } from "react";
import { createPublicSupabase } from "./supabase/server";
import type { BlogPost, PostCategory } from "./supabase/database.types";
import { calloutCategories, journalCategories } from "./post-utils";
import { callouts } from "./content";

// Preserve the original preview when no backend has been configured at all.
// A configured database is authoritative: errors never fall back to stale posts.
const archivePosts: BlogPost[] = callouts.map((item) => ({
  id: `archive-${item.id}`,
  slug: item.slug,
  title: item.title,
  excerpt: item.summary,
  body: item.detail,
  category: "Incident",
  status: "published",
  event_date: item.date,
  location: item.location,
  incident_number: item.id,
  rescue_type: item.category,
  source_url: item.source,
  cover_path: null,
  cover_alt: null,
  cover_caption: null,
  author_id: null,
  published_at: `${item.date}T12:00:00Z`,
  created_at: `${item.date}T12:00:00Z`,
  updated_at: `${item.date}T12:00:00Z`,
}));

export const getPublishedPosts = cache(async (category?: PostCategory) => {
  const client = createPublicSupabase();
  if (!client)
    return archivePosts.filter((p) => !category || p.category === category);
  let query = client
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error)
    throw new Error(
      "The journal could not be loaded. Please try again shortly.",
    );
  return data;
});

export const getPublishedCallouts = cache(async () => {
  const client = createPublicSupabase();
  if (!client) return archivePosts;
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .in("category", [...calloutCategories])
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error("The call-outs could not be loaded. Please try again shortly.");
  return data;
});

export const getPublishedJournalPosts = cache(async () => {
  const client = createPublicSupabase();
  if (!client)
    return archivePosts.filter((post) => journalCategories.includes(post.category as (typeof journalCategories)[number]));
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .in("category", [...journalCategories])
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error("The journal could not be loaded. Please try again shortly.");
  return data;
});

export const getPublishedPost = cache(async (slug: string) => {
  const client = createPublicSupabase();
  if (!client) return archivePosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error)
    throw new Error(
      "This story could not be loaded. Please try again shortly.",
    );
  return data;
});
