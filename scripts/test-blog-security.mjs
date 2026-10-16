// Integration test against the real local Supabase stack. Fixtures are removed.
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
assert.equal(
  new URL(status.API_URL).hostname,
  "127.0.0.1",
  "Tests must only run locally",
);
const makeClient = (key = status.PUBLISHABLE_KEY) =>
  createClient(status.API_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const owner = makeClient(status.SECRET_KEY);
const anon = makeClient();
const userIds = [];
const postIds = [];
const photo = `${randomUUID()}.png`;
let checks = 0;
const ok = (value, message) => {
  assert.ok(value, message);
  checks++;
  console.log(`PASS ${message}`);
};
const base = process.argv[2] || "http://localhost:3000";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));

async function account(role) {
  const email = `security-${role}-${randomUUID()}@example.test`;
  const password = randomBytes(24).toString("base64url");
  const result = await owner.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  assert.ifError(result.error);
  userIds.push(result.data.user.id);
  const client = makeClient();
  assert.ifError(
    (await client.auth.signInWithPassword({ email, password })).error,
  );
  return { client, id: result.data.user.id };
}

try {
  const admin = await account("admin");
  const member = await account("member");
  assert.ifError(
    (await owner.from("admin_users").insert({ user_id: admin.id })).error,
  );
  const draft = {
    slug: `security-test-${randomUUID()}`,
    title: "Security test fixture",
    excerpt: "A temporary local test of rescue publishing.",
    body: "This temporary test fixture verifies that unpublished stories stay private.",
    event_date: "2026-10-13",
    category: "Rescue",
    author_id: admin.id,
  };
  ok(
    (await anon.from("blog_posts").insert(draft)).error,
    "Anonymous visitors cannot create posts",
  );
  ok(
    (
      await member.client
        .from("blog_posts")
        .insert({ ...draft, author_id: member.id })
    ).error,
    "Signed-in non-admins cannot create posts",
  );
  ok(
    (await member.client.from("admin_users").insert({ user_id: member.id }))
      .error,
    "Users cannot grant themselves admin access",
  );
  await member.client.auth.updateUser({
    data: { role: "admin", is_admin: true },
  });
  ok(
    (
      await member.client
        .from("blog_posts")
        .insert({ ...draft, author_id: member.id })
    ).error,
    "User-editable metadata cannot grant admin access",
  );

  const insert = await admin.client
    .from("blog_posts")
    .insert(draft)
    .select()
    .single();
  assert.ifError(insert.error);
  const post = insert.data;
  postIds.push(post.id);
  ok(post.status === "draft", "Admins can create a persisted draft");
  ok(
    (await anon.from("blog_posts").select("id").eq("id", post.id)).data
      .length === 0,
    "Anonymous API clients cannot read drafts",
  );
  ok(
    (await member.client.from("blog_posts").select("id").eq("id", post.id)).data
      .length === 0,
    "Signed-in non-admins cannot read drafts",
  );
  ok(
    (await fetch(`${base}/blog/${post.slug}`)).status === 404,
    "Draft URLs return 404 publicly",
  );
  const access = await fetch(`${base}/admin/posts/${post.id}`, {
    redirect: "manual",
  });
  ok(
    access.status === 307 && access.headers.get("location") === "/admin/login",
    "Direct editor access redirects to login",
  );
  ok(
    access.headers.get("cache-control")?.includes("no-store"),
    "Protected responses are never cached",
  );

  const bytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=",
    "base64",
  );
  ok(
    (
      await member.client.storage
        .from("blog-images")
        .upload(photo, bytes, { contentType: "image/png" })
    ).error,
    "Non-admins cannot upload images",
  );
  assert.ifError(
    (
      await admin.client.storage
        .from("blog-images")
        .upload(photo, bytes, { contentType: "image/png" })
    ).error,
  );
  assert.ifError(
    (
      await admin.client
        .from("blog_posts")
        .update({ cover_path: photo, cover_alt: "Test pixel" })
        .eq("id", post.id)
    ).error,
  );
  ok(
    (await anon.storage.from("blog-images").download(photo)).error,
    "Draft photos stay private in Supabase Storage",
  );
  ok(
    (await fetch(`${base}/media/${photo}`)).status === 404,
    "Draft photos stay private through the website",
  );
  const publish = await admin.client
    .from("blog_posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", post.id)
    .select()
    .single();
  assert.ifError(publish.error);
  ok(
    (await anon.from("blog_posts").select("id").eq("id", post.id)).data
      .length === 1,
    "Published posts are publicly readable",
  );
  ok(
    (await fetch(`${base}/blog/${post.slug}`)).status === 200,
    "Published story has a working public URL",
  );
  ok(
    !(await anon.storage.from("blog-images").download(photo)).error,
    "Published cover photos are readable",
  );
  const imageResponse = await fetch(`${base}/media/${photo}`);
  ok(
    imageResponse.status === 200 &&
      imageResponse.headers.get("cache-control")?.includes("no-store"),
    "Photo delivery works without a persistent cache",
  );
  const memberEdit = await member.client
    .from("blog_posts")
    .update({ title: "Unauthorized" })
    .eq("id", post.id)
    .select();
  ok(!memberEdit.data?.length, "Non-admins cannot edit a published post");
  ok(
    (
      await admin.client
        .from("blog_posts")
        .update({ slug: "changed-url" })
        .eq("id", post.id)
    ).error,
    "Saved post URLs cannot be changed",
  );
  const stale = await admin.client
    .from("blog_posts")
    .update({ title: "Stale edit" })
    .eq("id", post.id)
    .eq("updated_at", post.updated_at)
    .select();
  ok(stale.data?.length === 0, "Stale edits cannot overwrite a newer version");
  ok(
    (await admin.client.from("blog_posts").delete().eq("id", post.id)).error,
    "Admins archive rather than permanently delete posts",
  );
  assert.ifError(
    (
      await admin.client
        .from("blog_posts")
        .update({ status: "draft" })
        .eq("id", post.id)
    ).error,
  );
  ok(
    (await fetch(`${base}/blog/${post.slug}`)).status === 404,
    "Unpublishing immediately removes public access",
  );
  ok(
    (await fetch(`${base}/media/${photo}`)).status === 404,
    "Unpublishing immediately removes public photo access",
  );
  assert.ifError(
    (await owner.from("admin_users").delete().eq("user_id", admin.id)).error,
  );
  ok(
    !(
      await admin.client
        .from("blog_posts")
        .update({ title: "Revoked edit" })
        .eq("id", post.id)
        .select()
    ).data?.length,
    "Revoked admins cannot write with an existing token",
  );
  ok(
    (await admin.client.storage.from("blog-images").download(photo)).error,
    "Revoked admins lose draft photo access immediately",
  );
  console.log(
    `\n${checks} authentication, database, storage and route checks passed.`,
  );
} finally {
  for (const id of postIds)
    await owner.from("blog_posts").delete().eq("id", id);
  await owner.storage.from("blog-images").remove([photo]);
  for (const id of userIds) await owner.auth.admin.deleteUser(id);
}
