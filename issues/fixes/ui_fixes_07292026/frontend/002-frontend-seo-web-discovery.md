## Objective

Improve **search engine discoverability** and link-preview quality so the Youth Go Budget App (YGB) public surfaces can be indexed and recommended by Google and other search engines when people search for PDM, youth budget participation, or related terms in Uganda.

Today `frontend/index.html` only sets `<title>`, `theme-color`, and favicon — insufficient for SEO and social sharing.

## Current state

| Asset | Location | Gap |
|-------|----------|-----|
| `index.html` | `frontend/index.html` | No meta description, Open Graph, Twitter Card, canonical URL |
| SPA routing | `AppRouter.tsx` | Single HTML shell; route-specific titles/descriptions not set |
| Public content | `/dashboard`, `/resources`, `/budget-priorities`, etc. | Rich content exists but crawlers see one generic page unless prerendered or tagged per route |
| `robots.txt` | missing | No crawl guidance |
| `sitemap.xml` | missing | No URL discovery for static public routes |
| Structured data | missing | No JSON-LD (Organization, WebSite, WebApplication) |

Production domain (from codebase references): `youthgobudgetapp.org`.

## Architectural Context

- **Frontend static + adapters** — `index.html`, optional `public/robots.txt`, `public/sitemap.xml`, per-route meta via React (`usePageMeta` hook + `site-meta.ts`).
- **Build / deploy** — ensure Vercel/host serves `robots.txt` and `sitemap.xml`; verify HTTPS canonical.
- **Backend** — none required for baseline; optional future `GET /sitemap.xml` if routes become dynamic.

## Proposed approach

### 1. Global defaults (`index.html` or injected at build)

- `<meta name="description">` — concise value proposition (PDM field data, public dashboards, Uganda youth budget).
- `<meta name="keywords">` — sparing, accurate terms (not spam).
- `<link rel="canonical" href="https://youthgobudgetapp.org/">`
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type`, `og:image` (reuse `pwa-512.png` or dedicated share image).
- Twitter Card: `summary_large_image`.
- `<html lang="en">` (already present).

### 2. Per-route metadata (public routes)

Set document title + description when navigating to key public pages:

| Route | Example title |
|-------|----------------|
| `/` or `/dashboard` | Public PDM Dashboard \| Youth Go Budget App |
| `/resources` | PDM Resources \| Youth Go Budget App |
| `/budget-priorities` | Community Budget Priorities \| YGB |
| `/resources/budget-allocations` | LGO Budget Allocations \| YGB |
| `/login` | Staff Sign In \| Youth Go Budget App |

Implementation: `usePageMeta({ title, description, canonicalPath })` called from layout or page components.

### 3. Crawl assets

- `public/robots.txt` — allow public paths; disallow `/admin`, `/collector`, `/login`.
- `public/sitemap.xml` — list stable public URLs with `<lastmod>` (static file updated on release or generated in build script).

### 4. Structured data (JSON-LD)

Add to public home or layout:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Youth Go Budget App",
  "applicationCategory": "GovernmentApplication",
  "operatingSystem": "Web",
  "url": "https://youthgobudgetapp.org"
}
```

Optional `Organization` with NAC / programme context if client approves copy.

### 5. Performance & indexing hygiene

- Ensure public pages render meaningful text without auth (already true).
- Lazy routes: verify LCP text is not empty on first paint for `/dashboard`.
- Add `manifest` link in HTML if not already injected by Vite PWA plugin (verify built output).

### 6. Verification

- Google Search Console setup (manual, documented in deploy notes).
- Rich Results Test / Facebook Sharing Debugger / Twitter Card Validator on staging URL.

## Acceptance Criteria & TDD Checklist

- [x] `index.html` (or equivalent) includes description + OG + Twitter meta tags.
- [x] `public/robots.txt` and `public/sitemap.xml` exist and are served in production build.
- [x] Unit test: `applyPageMeta` sets `document.title` and meta description tag.
- [x] Unit test: sitemap includes `/dashboard`, `/resources`, `/budget-priorities` (at minimum).
- [x] Public dashboard route sets unique `<title>` distinct from login page.
- [x] JSON-LD script present on public layout (snapshot test or DOM assertion).
- [ ] Manual: view-source / built `index.html` shows meta; Lighthouse SEO score baseline recorded.
- [ ] Manual: share link preview shows title, description, and image (WhatsApp / Slack / X).

## Out of scope

- Paid search / Google Ads campaigns.
- Blog or CMS content strategy.
- Server-side rendering (SSR) — revisit only if indexing proves insufficient after baseline.

## Blocked by

None — can start immediately.

## Notes for implementer

- Coordinate marketing copy with client (NAC / YGB programme wording) before locking description strings.
- Use production URL from env (`VITE_APP_ORIGIN` or similar) for canonical and OG URLs across environments.
