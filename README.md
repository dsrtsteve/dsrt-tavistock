# Dartmoor Search & Rescue — Tavistock

A modern, responsive recreation of [dsrt-tavistock.org.uk](https://dsrt-tavistock.org.uk/), built with Next.js App Router, TypeScript, React and Tailwind CSS v4.

## Run locally

Requires Node.js 22+ and npm. The working `.env.local` is connected to the hosted DSRT Tavistock Supabase project.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

With the server running, check every internally linked page and the 404 response:

```sh
node scripts/check-routes.mjs
```

## Included

- Responsive homepage, persistent navigation and keyboard-operable mobile menu.
- About, specialist skills and six individual skill pages.
- Supabase-backed journal, searchable categories, rescue archive and four imported incident summaries.
- Admin sign-in, protected dashboard, Markdown editor/preview, photo uploads, drafts, publishing, unpublishing and archiving.
- Twitter/X, LinkedIn, Facebook and copy-link sharing, inspired by the requested [Blog Share block](https://www.shadcn.io/blocks/blog-share). Original component implementation; no premium source code or invented share counts.
- Donation, recruitment, supporters, contact, books and 11 Tors pages.
- Emergency instructions, real contact email links and the verified team JustGiving destination.
- Original generated landscape and team imagery, optimised as WebP and served with Next Image.
- Route metadata, accessible labels, visible focus states, reduced-motion support and a custom 404.

## Project structure

- `src/app/page.tsx`: homepage.
- `src/app/[...slug]/page.tsx`: statically generated content pages.
- `src/app/blog/`: public journal and article routes.
- `src/app/admin/`: protected admin workspace, login and server actions.
- `src/app/media/`: private photo delivery using the visitor's actual Supabase permissions.
- `src/proxy.ts`: session refresh and private response cache headers.
- `src/lib/supabase/`: request-specific clients and schema types.
- `supabase/migrations/`: versioned database schema and RLS policies, applied to the hosted project.
- `supabase/seed.sql`: the original four publicly sourced reports, safe to re-run.
- `docs/supabase-setup.md`: admin provisioning, local development and production configuration.
- `src/app/globals.css`: Tailwind v4 import, theme tokens and responsive component styling.
- `src/components/`: navigation, shared sections and interactive call-out search.
- `src/lib/content.ts`: navigation, specialist skills, incident summaries and source URLs.
- `public/images/`: local brand asset, generated originals and optimised site images.
- `docs/image-prompts.md`: complete prompts, generation method and asset provenance.
- `docs/content-sources.md`: content references and editorial decisions.

## Content and integration boundaries

This is a locally running redesign, not a deployed replacement for the team’s live website. Published information was checked on 13 October 2026. The four call-out summaries are a curated snapshot, not a complete or automatically updated archive. Each summary links to the original report.

The September 2026 11 Tors date is correctly treated as past. Recruitment points to the January 2027 expression-of-interest information published by the team.

Donations open the team’s verified JustGiving charity page. Email links open the visitor’s email app. General enquiries link to the existing team contact form. Supabase Auth stores admin accounts, Postgres stores journal posts, and Supabase Storage holds uploaded photos. There is no public registration form, analytics, mailing-list signup or simulated payment flow.

Only users explicitly provisioned in `public.admin_users` can edit content. Database and storage RLS enforce this independently of the UI. Public queries explicitly request published posts using a stateless public client, even when an admin is browsing. Photos are private until used by a published post. The media route is uncacheable, so unpublishing also removes photo access. Markdown does not render raw HTML or arbitrary inline images. The application uses only a publishable Supabase key; no service-role key is required.

Rescue posts appear automatically in the journal, Call-outs and homepage. Existing `/call-outs/[slug]` URLs redirect to the journal; `/latest-news` redirects to `/blog`. Saved slugs are permanent. Concurrent edits are detected using `updated_at`; a stale save cannot silently overwrite another admin. Archiving is reversible. Uploaded files are immutable and retained when removed from a post; clean up unused images through Supabase Storage when appropriate.

Generated images are illustrative, not evidence of an actual incident or real team members. Captions and the privacy / image credits page disclose this. The official logo supplied by the user is used across the shared header, footer, content badge and browser icons, with its original colours, transparency and proportions. Its ownership is unchanged.

Search indexing is disabled in `src/app/layout.tsx` while this is a preview. Before production launch, configure `NEXT_PUBLIC_SITE_URL` and Supabase's Site URL for the final domain, confirm the content and images with the team, update the privacy information and enable indexing. The Next.js frontend currently runs locally; its Supabase backend is hosted.

## Dependency audit

The production dependency audit (`npm audit --omit=dev`) reports zero vulnerabilities. The full audit reports five inherited development-tool advisories in the ESLint → fast-glob → micromatch → braces chain. The registry’s latest braces release (3.0.3) has no fix for the reported deeply nested pattern denial-of-service issue. The suggested forced fix would downgrade the Next.js lint configuration by two major versions, so it has not been applied. Sharp was updated to 0.35.5 to resolve its reported advisories.
