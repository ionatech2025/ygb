## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

Public Download hub at **`/download`**: single-tool picker, optional filters, CSV/Excel actions behind the existing download-profile gate (including optional improvement feedback from 005). Chart pages (PDM, Budget Priorities, LGO Budget Allocation) **remove export toolbars** and link to the hub with optional `?dataset=` preselect.

Mobile-usable layout for chooser, filters, and format buttons.

## Acceptance criteria

- [x] `/download` is in public navigation; works on small screens.
- [x] Visitor selects exactly one of the six tools; optional filters; CSV and Excel download via public hub APIs.
- [x] Profile gate runs once per valid session and unlocks hub downloads across tools for that visit; dialog includes optional improvement-feedback field.
- [x] Deep link `/download?dataset=BYP` (and peers) preselects the tool.
- [x] PDM / Budget Priorities / LGO Budget Allocation chart pages have **no** export toolbar; CTAs link to `/download` (with dataset when applicable).
- [x] Ports/adapters for hub download + profile register; no direct `fetch` in pages.
- [x] Component/route tests: tool selection, filters, formats, gate, chart CTA links, feedback field optional.

## Blocked by

- [`004-backend-public-admin-per-tool-download-apis.md`](./004-backend-public-admin-per-tool-download-apis.md)
- [`005-backend-download-usage-enum-and-improvement-feedback.md`](./005-backend-download-usage-enum-and-improvement-feedback.md)

## User stories addressed

- 1, 2, 3, 4, 10, 13, 14, 15, 16, 17, 20, 29, 34

## Implemented

- Domain: `tool-field-download.model` (six hub datasets, filters, deep links); download profile `improvementFeedback` (max 2000, optional)
- Port/adapter: `IPublicToolDownloadApiPort` / `HttpPublicToolDownloadAdapter` → `GET /api/v1/public/downloads/{dataset}/csv|excel`
- UI: `PublicDownloadHubPage` at `/download`; `PublicDownloadHubCta`; `DownloadProfileDialog` feedback textarea; Public nav + route + SEO
- Chart pages: PDM / Budget Priorities / LGO Budget Allocation export toolbars replaced with hub CTAs
