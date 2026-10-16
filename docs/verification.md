# Verification

Date: 13 October 2026

## Build and route checks

- Next.js 16.4.0 / React 19.3.0 / Tailwind CSS 4.3.3.
- Production build and TypeScript check passed.
- ESLint passed without errors or warnings.
- HTTP crawl: all 23 linked pages returned 200, each with one main heading.
- An unknown route returned 404 with the custom recovery page.
- Production dependency audit: zero vulnerabilities. See README for the outstanding development-only advisory chain.

## Browser verification

Verified in the Codex in-app browser against the running local server.

- Desktop homepage and complete page inspected at 1440px.
- Mobile homepage inspected at 390px; hero line wrapping and image crop adjusted.
- No horizontal overflow at 320px, 390px, 768px, 1024px or 1440px on the homepage.
- Mobile menu opens, dismisses with Escape and closes after navigation.
- Call-out search for “Leather” returns the Leather Tor report.
- Combining that search with the medical category displays the empty state.
- Clearing filters restores all four reports.
- Medical category displays one matching report.
- Incident selection opens the matching report with source attribution.
- Donation destination is the verified team JustGiving charity page; mobile donation panel appears before the supporting copy.
- Contact page has the correct emergency, email and map links, with no mobile overflow.
- No browser console errors observed during these checks.
- External payments, mail sending and contact form submission were not performed.
- The user-supplied official logo is used by the shared header, footer, content badge and browser icons, preserving the source image and aspect ratio.

## Saved evidence

- `screenshots/home-desktop.png`
- `screenshots/home-mobile.png`
- `screenshots/home-full.png`

## Scope

This is a functional frontend and static content build. No CMS, live incident feed or contact backend is connected. Donation and contact actions use existing real services. Images are marked as AI-generated illustrations. This is a modern reinterpretation, not a pixel-for-pixel copy of the original WordPress site.
# Journal and admin update — 13 October 2026

- Hosted Supabase connected to the user-created DSRT Tavistock project in Xium; the separate Teem-Darts project was not modified.
- Applied `20261013134204_blog_admin.sql`, imported four sourced rescue summaries and verified the requested admin membership.
- Lint, TypeScript, production build and a crawl of 24 linked routes plus the custom 404 passed.
- Production dependency audit: zero vulnerabilities. Existing development-only advisories remain documented in README.
- 25 real local Supabase integration checks passed for role enforcement, token metadata escalation, draft privacy, photo access, publication, revocation, permanent URLs, concurrency and cache headers.
- Browser verified: invalid and valid login, protected routes, validation preserving unsaved content, image upload, Markdown preview, draft save/reload, update, publish, unpublish, archive, journal search, social URLs and copy feedback. Clipboard contained the current article URL.
- Checked the admin editor and article at desktop and 390px mobile widths with no horizontal overflow. Mobile sharing uses a two-column button arrangement.
- Hosted public API returned exactly four published stories and denied anonymous admin-table access. Supabase security advisor returned zero issues. Its performance advisor had only expected unused-index informational notices on the fresh schema.
- Temporary local test accounts, uploaded image and browser-test post were removed; local Docker services were stopped with data retained. The running website now uses hosted Supabase.
- Admin screenshots document the locally tested editor; hosted account passwords were never requested or read. Browser sign-in with the owner's hosted password is left to the owner.

