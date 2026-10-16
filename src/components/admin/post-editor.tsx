"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ImagePlus,
  Save,
  Send,
} from "lucide-react";
import { savePost, uploadCover, type FormState } from "@/app/admin/actions";
import { categories, mediaUrl, slugify } from "@/lib/post-utils";
import type { BlogPost } from "@/lib/supabase/database.types";
import { PostBody } from "@/components/post-body";

export function PostEditor({
  post,
  justSaved = false,
}: {
  post?: BlogPost;
  justSaved?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [customSlug, setCustomSlug] = useState(!!post);
  const [body, setBody] = useState(post?.body ?? "");
  const [category, setCategory] = useState(post?.category ?? "Rescue");
  const [cover, setCover] = useState(post?.cover_path ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState(
    async (previous: FormState, form: FormData) => {
      try {
        const result = await savePost(previous, form);
        if (result.success) {
          setDirty(false);
          if (!post && result.id)
            router.replace(`/admin/posts/${result.id}?saved=1`);
        }
        return result;
      } catch {
        return {
          error:
            "We couldn’t reach the server. Your changes are still here; try saving again.",
        };
      }
    },
    {},
  );
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function handleUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.set("image", file);
      const result = await uploadCover(form);
      if (result.error) setUploadError(result.error);
      if (result.path) {
        setCover(result.path);
        setDirty(true);
      }
    } catch {
      setUploadError(
        "The upload did not finish. Check your connection and try again.",
      );
    } finally {
      setUploading(false);
    }
  }
  const savedStatus = state.status ?? post?.status ?? "draft";
  return (
    <>
      <Link
        href="/admin"
        className="admin-back"
        onClick={(event) => {
          if (
            dirty &&
            !window.confirm(
              "Leave this editor? Your unsaved changes will be lost.",
            )
          )
            event.preventDefault();
        }}
      >
        <ArrowLeft size={16} /> All stories
      </Link>
      <div className="editor-heading">
        <div>
          <span className="eyebrow">THE TEAM JOURNAL</span>
          <h1>{post ? "Shape your story." : "Tell the next story."}</h1>
        </div>
        <span className={`status-badge status-${savedStatus}`}>
          {savedStatus}
        </span>
      </div>
      <form
        action={action}
        onReset={(e) => e.preventDefault()}
        onChange={() => setDirty(true)}
        className="editor-form"
      >
        <input type="hidden" name="id" value={state.id ?? post?.id ?? ""} />
        <input
          type="hidden"
          name="updated_at"
          value={state.updatedAt ?? post?.updated_at ?? ""}
        />
        <input type="hidden" name="body" value={body} />
        <input type="hidden" name="cover_path" value={cover} />
        <div className="editor-main admin-form">
          <section className="editor-card">
            <h2>The story</h2>
            <p className="field-help">A clear account, in your own words.</p>
            <label htmlFor="post-title">
              Title
              <input
                id="post-title"
                name="title"
                value={title}
                maxLength={160}
                minLength={3}
                required
                placeholder="Give your story a title"
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!customSlug) setSlug(slugify(e.target.value));
                }}
              />
            </label>
            <label htmlFor="post-slug">
              Post URL
              <div className="slug-field">
                <span>/blog/</span>
                <input
                  id="post-slug"
                  name="slug"
                  value={slug}
                  maxLength={100}
                  required
                  readOnly={!!post || !!state.id}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  onChange={(e) => {
                    setCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                />
              </div>
            </label>
            <p className="field-help">
              {post
                ? "The URL stays the same so shared links keep working."
                : "Use lowercase letters, numbers and hyphens. This stays fixed after the first save."}
            </p>
            <label htmlFor="excerpt">
              Short summary
              <textarea
                id="excerpt"
                name="excerpt"
                defaultValue={post?.excerpt}
                required
                minLength={10}
                maxLength={350}
                rows={3}
                placeholder="A few sentences to introduce the story…"
              />
            </label>
            <div className="body-label">
              <label htmlFor="post-body">Story</label>
              <div className="editor-tabs">
                <button
                  type="button"
                  aria-pressed={!preview}
                  onClick={() => setPreview(false)}
                >
                  Write
                </button>
                <button
                  type="button"
                  aria-pressed={preview}
                  onClick={() => setPreview(true)}
                >
                  Preview
                </button>
              </div>
            </div>
            {preview ? (
              <div className="markdown-preview">
                {body ? (
                  <PostBody body={body} />
                ) : (
                  <p>Your story preview will appear here.</p>
                )}
              </div>
            ) : (
              <textarea
                id="post-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={17}
                maxLength={100000}
                placeholder="What happened? How did the team help?"
                className="story-input"
              />
            )}
            <p className="field-help">
              Format with ## headings, **bold**, *italics*, bullet lists and
              [link text](https://…).
            </p>
          </section>
          <section className="editor-card">
            <h2>Cover photograph</h2>
            <p className="field-help">
              Optional. Draft photos stay private until the post is published.
            </p>
            {cover ? (
              <div className="cover-preview">
                <Image
                  unoptimized
                  width={1600}
                  height={1067}
                  src={mediaUrl(cover)}
                  alt="Uploaded cover preview"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCover("");
                    setDirty(true);
                  }}
                >
                  Remove from post
                </button>
              </div>
            ) : null}
            <label className="image-upload">
              <ImagePlus size={24} />
              <span>
                {uploading
                  ? "Uploading your photo…"
                  : cover
                    ? "Choose a different photo"
                    : "Choose a cover photo"}
              </span>
              <small>JPEG, PNG or WebP · up to 5 MB</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading || pending}
                onChange={(e) => void handleUpload(e.target.files?.[0])}
              />
            </label>
            {uploadError && (
              <p role="alert" className="form-message form-error">
                {uploadError}
              </p>
            )}
            <label htmlFor="cover-alt">
              Photo description
              <input
                id="cover-alt"
                name="cover_alt"
                defaultValue={post?.cover_alt ?? ""}
                maxLength={300}
                required={!!cover}
                placeholder="Describe what is in the photograph"
              />
            </label>
            <label htmlFor="cover-caption">
              Caption or credit
              <input
                id="cover-caption"
                name="cover_caption"
                defaultValue={post?.cover_caption ?? ""}
                maxLength={500}
                placeholder="Photographer credit or additional context"
              />
            </label>
          </section>
        </div>
        <aside className="editor-sidebar admin-form">
          <section className="editor-card">
            <h2>Post details</h2>
            <label htmlFor="category">
              Category
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as BlogPost["category"])
                }
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label htmlFor="event-date">
              Report date
              <input
                type="date"
                id="event-date"
                name="event_date"
                defaultValue={
                  post?.event_date ?? new Date().toISOString().slice(0, 10)
                }
                required
              />
            </label>
            <label htmlFor="location">
              Location <span>(optional)</span>
              <input
                id="location"
                name="location"
                defaultValue={post?.location ?? ""}
                maxLength={150}
                placeholder="e.g. Beardown Tor"
              />
            </label>
            {category === "Rescue" && (
              <>
                <label htmlFor="incident">
                  Incident number <span>(optional)</span>
                  <input
                    id="incident"
                    type="number"
                    name="incident_number"
                    min={1}
                    max={2147483647}
                    step={1}
                    defaultValue={post?.incident_number ?? ""}
                  />
                </label>
                <label htmlFor="rescue-type">
                  Rescue type <span>(optional)</span>
                  <input
                    id="rescue-type"
                    name="rescue_type"
                    defaultValue={post?.rescue_type ?? ""}
                    maxLength={100}
                    placeholder="e.g. Casualty evacuation"
                  />
                </label>
              </>
            )}
            <label htmlFor="source">
              Original report <span>(optional)</span>
              <input
                id="source"
                type="url"
                name="source_url"
                defaultValue={post?.source_url ?? ""}
                maxLength={2000}
                placeholder="https://…"
              />
            </label>
          </section>
          <section className="editor-card publish-card">
            <h2>Ready when you are.</h2>
            <p>
              Save a draft for the team, or publish it to the journal. Rescue
              posts also appear in Call-outs.
            </p>
            <button
              className="button button-red"
              name="status"
              value="published"
              disabled={pending || uploading}
            >
              <Send size={16} />
              {pending
                ? "Saving…"
                : savedStatus === "published"
                  ? "Update published post"
                  : "Publish story"}
            </button>
            <button
              className="button button-outline"
              name="status"
              value="draft"
              disabled={pending || uploading}
            >
              <Save size={16} />
              {savedStatus === "published"
                ? "Unpublish to draft"
                : "Save draft"}
            </button>
            {post && (
              <button
                className="archive-button"
                name="status"
                value="archived"
                disabled={pending || uploading}
              >
                Archive story
              </button>
            )}
            <p className="field-help">
              Archived stories can be reopened and published again.
            </p>
            {(state.success || (justSaved && !dirty)) && (
              <p className="form-message form-success" role="status">
                <CheckCircle2 size={17} />
                {state.success ?? "Your story has been saved."}
              </p>
            )}
            {state.error && (
              <p className="form-message form-error" role="alert">
                {state.error}
              </p>
            )}
            {savedStatus === "published" && post && (
              <Link
                className="text-link"
                href={`/blog/${post.slug}`}
                target="_blank"
              >
                View live story <ArrowUpRight size={16} />
              </Link>
            )}
            <span className="save-status" aria-live="polite">
              {dirty
                ? "You have unsaved changes"
                : post || state.id
                  ? "All changes saved"
                  : "New story · Not saved yet"}
            </span>
          </section>
        </aside>
      </form>
    </>
  );
}
