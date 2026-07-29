# UI fixes — July 29, 2026

Follow-up polish from production / mobile field testing after the initial mobile-collector-ux rollout (`fixes` branch, commit `9c12af3`). Screenshots captured 29 Jul 2026.

## Problems observed

| # | Symptom | Screenshot reference |
|---|---------|----------------------|
| 1 | `FormSelect` renders **expanded radio lists** or **inline lists that grow with the page** | Images 1–4 |
| 2 | Public / admin dashboard filters still use **native `<select>`** | Image 5 |
| 3 | Login portal **informational panel** uses a different visual language than the rest of the app (blue grid vs dark theme tokens) | Login screenshot |
| 4 | Minimal HTML metadata — poor discoverability in search engines | — |
| 5 | Admin **PDF report** is plain text tables — not suitable for stakeholder presentations | — |

## Issue breakdown

| # | Issue | Layer | Summary |
|---|-------|-------|---------|
| 001 | [Scrollable dropdown picker (all forms)](./frontend/001-frontend-scrollable-dropdown-picker-all-forms.md) | Frontend | Collapsed overlay dropdowns; migrate remaining native selects |
| 002 | [SEO and web discovery](./frontend/002-frontend-seo-web-discovery.md) | Frontend | Meta tags, Open Graph, structured data, sitemap, crawl-friendly public routes |
| 003 | [Admin PDF report enhancement](./backend/003-backend-admin-pdf-report-enhancement.md) | Backend | Database-backed PDF with branding, charts, and print-quality layout |

## Recommended order

1. **001** — highest impact on daily collector UX (forms + dashboards)
2. **002** — SEO / public discovery (can ship with login redesign)
3. **003** — stakeholder reporting (backend-heavy; independent of frontend polish)

## Related prior work

- [mobile-collector-ux/frontend/001](../../mobile-collector-ux/frontend/001-frontend-mobile-select-picker-ux.md) — introduced `FormSelect`
- [mobile-collector-ux/frontend/007](../../mobile-collector-ux/frontend/007-frontend-pwa-icon-ygb-monogram.md) — PWA icon + manifest label
- [epic-5/004-backend-export-csv-excel-pdf.md](../../epic-5-admin-dashboard/backend-issues/004-backend-export-csv-excel-pdf.md) — export MVP including basic PDF
