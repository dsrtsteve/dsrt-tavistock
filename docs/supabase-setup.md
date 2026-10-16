# Supabase and the team journal

The app is connected to the **dsrt-tavistock** project (ref `dgxykwpcyjaavdrgdlqk`) in the user's **DSRT Tavistock** Supabase organization, region `eu-west-2` (London). The project was created on 2026-10-16.

The production schema, private image bucket and four starter reports are applied. The migration version `20261013134204` is recorded in the remote migration history. The WordPress export added 154 published reports; five drafts were excluded and four reports already covered by the starter seed were skipped. Imported HTML was converted to readable text; WordPress images were not copied. `.env.local` contains the project URL, publishable key and local site origin; it is ignored by Git. Copy `.env.example` when configuring a different environment. The app never needs a secret/service-role key.

## Admin access

Open `/admin/login`. The first admin account has been invited and granted admin membership in this project. Accept the Supabase invitation and choose a password on `/auth/complete`; then sign in at `/admin/login`. Accounts must be created through Supabase Authentication and explicitly granted admin membership; simply signing up or changing user metadata does not grant privileges. Passwords are managed in Supabase and are never stored by the app.

For another admin:

1. In the project's Authentication → Users screen, invite the user. They accept the invitation and choose their password on the app's `/auth/complete` page.
2. Run this parameterised-by-email example in the project's SQL editor after replacing the placeholder:

```sql
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('admin@example.org')
on conflict (user_id) do nothing;
```

To revoke access, delete that user's row from `admin_users`. RLS reads membership on each request, so an existing token does not retain admin permissions. The Auth account can be retained without editorial access. There is no app-side user-management interface or public registration page. Password resets are handled by the team administrator through Supabase; this app does not send invitation or password-reset emails.

## Authoring

- `/admin`: search stories and filter drafts, published and archived posts.
- **New story**: enter a title, permanent slug, summary, Markdown story and category.
- Rescue stories may have an incident number, location and rescue type. All stories have a report date.
- Optional JPEG, PNG and WebP cover photos can be uploaded up to 5 MB. A description is required for an uploaded photo; credits are optional.
- **Save draft** keeps the story and image private. **Publish story** makes them public. **Unpublish to draft** removes public access. **Archive story** hides it but retains its content for later restoration.
- If another admin has edited the same post, save is rejected with an explanation. Copy unsaved changes before reloading.
- A cover removed from a post remains in the private bucket. This preserves shared references and avoids irreversible deletion in the editor.

## Database and photo permissions

`admin_users` exposes only a user's own membership row to authenticated users, with no client write grants. `blog_posts` grants public SELECT only for published rows and INSERT/UPDATE only to admins. No client DELETE is granted. Published slugs cannot change; timestamps and author identity are maintained by a trigger.

`blog-images` is a private bucket. Admins can upload new immutable objects and read all objects. Public access is allowed only for an object currently referenced by a published post. `/media/[path]` downloads using the request's actual session and returns `private, no-store` responses. Next Image optimization is deliberately disabled for these authenticated assets to avoid bypassing permission checks through a shared image cache.

The schema migration filename matches the hosted migration history. `seed.sql` imports only public, sourced content and is idempotent. Do not add real user IDs, passwords or test accounts to migrations.

## Local Supabase testing

Requires Docker and the Supabase CLI (the project was tested with `npx supabase`). The local stack is separate from the hosted project. `.env.supabase-local` preserves this machine's local URL/publishable key. To test locally, stop the Next dev server, temporarily switch `.env.local` to the local values, and restore the hosted configuration afterwards.

```sh
npx supabase start --exclude realtime,imgproxy,edge-runtime,logflare,vector,supavisor
# Configure .env.local with the local URL and publishable key from `supabase status`.
node scripts/create-local-admin.mjs
npm run dev
# In a second terminal:
npm run test:blog
npm run check:routes
```

`create-local-admin.mjs` creates a local-only admin and stores its generated credentials in the ignored `.env.admin.local` file with owner-only permissions. It refuses to run against a hosted API or overwrite an existing credential file. The security test creates temporary local accounts, posts and an image, then removes its fixtures. Run it only while the website is connected to that local stack. Never copy a local test account to the hosted project.

## Deployment configuration

- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL` in the hosting environment before building.
- Set Supabase Auth's Site URL to the final HTTPS origin. Disable public sign-ups if no other application uses this project; the app's authorization remains enforced either way.
- Keep admin routes and authenticated media responses uncached. No reverse proxy should override their `Cache-Control` headers.
- The blog's share URLs use the browser's actual origin. Open Graph and canonical URLs use `NEXT_PUBLIC_SITE_URL`.
- Public fallback reports are used only if Supabase is not configured at all. A configured backend error is shown as an error, not replaced with stale content.

## Verification

25 local integration checks passed: anonymous/member restrictions, user-metadata escalation denial, persisted drafts, publishing, unpublishing, image access, direct-route protection, cache headers, permanent URLs, optimistic concurrency, delete denial and immediate role revocation. Browser checks covered login errors, successful login, draft validation without data loss, upload, Markdown preview, saving/reloading, editing/publishing/unpublishing/archiving, responsive layout and copy-link feedback.

Hosted verification confirmed 158 published reports (four starter reports and 154 imported reports) in the new database. The production Vercel deployment reads the database and displays all 158 reports. The first admin invitation was sent and its Auth user was added to `admin_users`; finish password setup from the invitation email.

Docs checked: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs), [storage access control](https://supabase.com/docs/guides/storage/security/access-control), the Supabase changelog, and the Next.js documentation bundled with this installation.
