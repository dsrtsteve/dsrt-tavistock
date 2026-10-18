"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { getAdmin, requireAdmin } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import { categories, calloutCategories } from "@/lib/post-utils";
import type {
  BlogPost,
  PostCategory,
  PostStatus,
} from "@/lib/supabase/database.types";

export type FormState = {
  error?: string;
  success?: string;
  id?: string;
  updatedAt?: string;
  status?: PostStatus;
};
const value = (form: FormData, name: string) =>
  String(form.get(name) ?? "").trim();

export async function login(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  if (!supabaseConfig())
    return { error: "Admin access is waiting for the Supabase connection." };
  const email = value(form, "email");
  const password = String(form.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 1000)
    return { error: "Enter your email address and password." };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error)
    return {
      error: "Unable to sign in. Check your credentials and try again.",
    };
  const admin = await getAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return {
      error:
        "This account does not have admin access. Contact your team administrator.",
    };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function savePost(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const admin = await getAdmin();
  if (!admin)
    return {
      error:
        "Your admin session has expired. Sign in in another tab, then save again.",
    };
  const id = value(form, "id");
  const title = value(form, "title");
  const slug = value(form, "slug");
  const excerpt = value(form, "excerpt");
  const body = value(form, "body");
  const category = value(form, "category");
  const status = value(form, "status");
  const eventDate = value(form, "event_date");
  const location = value(form, "location");
  const rescueType = value(form, "rescue_type");
  const incident = value(form, "incident_number");
  const sourceUrl = value(form, "source_url");
  const coverPath = value(form, "cover_path");
  const coverAlt = value(form, "cover_alt");
  const coverCaption = value(form, "cover_caption");
  if (title.length < 3 || title.length > 160)
    return { error: "Use a title between 3 and 160 characters." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 100)
    return {
      error:
        "Use a URL made of lowercase letters, numbers and hyphens (up to 100 characters).",
    };
  if (excerpt.length < 10 || excerpt.length > 350)
    return { error: "Write a summary between 10 and 350 characters." };
  if (body.length < 20 || body.length > 100000)
    return { error: "Write a story between 20 and 100,000 characters." };
  if (
    !categories.includes(category as PostCategory) ||
    !["draft", "published", "archived"].includes(status)
  )
    return { error: "Choose a valid category and publication status." };
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
    Number.isNaN(Date.parse(eventDate)) ||
    new Date(eventDate).toISOString().slice(0, 10) !== eventDate
  )
    return { error: "Choose a valid report date." };
  if (
    location.length > 150 ||
    rescueType.length > 100 ||
    coverAlt.length > 300 ||
    coverCaption.length > 500
  )
    return {
      error: "One of the details is too long. Shorten it and try again.",
    };
  if (
    incident &&
    (!/^\d+$/.test(incident) ||
      Number(incident) < 1 ||
      Number(incident) > 2147483647)
  )
    return { error: "Use a positive whole number for the incident." };
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        sourceUrl.length > 2000
      )
        throw new Error();
    } catch {
      return { error: "Use a complete HTTPS address for the original report." };
    }
  }
  if (
    coverPath &&
    (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(coverPath) || !coverAlt)
  )
    return { error: "Upload a supported cover photo and add its description." };
  const { supabase, user } = admin;
  let existing: BlogPost | null = null;
  if (id) {
    if (!/^[a-f0-9-]{36}$/.test(id))
      return { error: "This post could not be found." };
    const result = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (result.error || !result.data)
      return {
        error:
          "This post could not be loaded. Your changes have not been saved.",
      };
    existing = result.data;
  }
  const data = {
    title,
    slug: existing?.slug ?? slug,
    excerpt,
    body,
    category: category as PostCategory,
    status: status as PostStatus,
    event_date: eventDate,
    location: location || null,
    rescue_type: calloutCategories.includes(category as (typeof calloutCategories)[number]) ? rescueType || null : null,
    incident_number:
      calloutCategories.includes(category as (typeof calloutCategories)[number]) && incident ? Number(incident) : null,
    source_url: sourceUrl || null,
    cover_path: coverPath || null,
    cover_alt: coverPath ? coverAlt : null,
    cover_caption: coverPath ? coverCaption || null : null,
    published_at:
      status === "published"
        ? (existing?.published_at ?? new Date().toISOString())
        : (existing?.published_at ?? null),
  };
  const result = existing
    ? await supabase
        .from("blog_posts")
        .update(data)
        .eq("id", existing.id)
        .eq("updated_at", value(form, "updated_at"))
        .select("id, updated_at, status")
        .maybeSingle()
    : await supabase
        .from("blog_posts")
        .insert({ ...data, author_id: user.id })
        .select("id, updated_at, status")
        .single();
  if (result.error)
    return {
      error:
        result.error.code === "23505"
          ? "That URL is already used. Choose a different post URL."
          : "We couldn’t save this post. Your changes are still here; please try again.",
    };
  if (!result.data)
    return {
      error:
        "Another admin has updated this post. Copy your changes, then reload before saving.",
    };
  [
    "/",
    "/blog",
    "/call-outs",
    "/latest-news",
    "/admin",
    `/blog/${data.slug}`,
    `/call-outs/${data.slug}`,
  ].forEach((path) => revalidatePath(path));
  return {
    success:
      status === "published"
        ? "Post published. It is now visible on the website."
        : status === "archived"
          ? "Post archived. It is no longer public."
          : "Draft saved. Only admins can see it.",
    id: result.data.id,
    updatedAt: result.data.updated_at,
    status: result.data.status,
  };
}

export async function uploadCover(
  form: FormData,
): Promise<{ path?: string; error?: string }> {
  const { supabase } = await requireAdmin();
  const file = form.get("image");
  if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024)
    return { error: "Choose an image smaller than 5 MB." };
  const buffer = Buffer.from(await file.arrayBuffer());
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp =
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  const ext = jpg ? "jpg" : png ? "png" : webp ? "webp" : null;
  if (!ext) return { error: "Choose a JPEG, PNG or WebP image." };
  const path = `${randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, buffer, {
      contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}`,
      upsert: false,
    });
  return error
    ? { error: "The image could not be uploaded. Please try again." }
    : { path };
}
