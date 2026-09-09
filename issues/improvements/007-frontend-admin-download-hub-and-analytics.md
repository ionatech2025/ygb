## Parent PRD

[`prd-per-tool-field-data-downloads.md`](./prd-per-tool-field-data-downloads.md)

## What to build

Admin Download hub at **`/admin/downloads`**: same tool picker, filters, and CSV/Excel as public, authenticated with admin JWT only (no profile dialog). Admin nav exposes Downloads separately from the operational submissions export. Wire public/admin download-usage charts to the **six datasets + “PDM (legacy)”** labels, and show optional improvement feedback in the **admin** downloaders area only.

Keep the existing admin dashboard **submissions** export toolbar behaviour unchanged.

## Acceptance criteria

- [x] `/admin/downloads` in admin nav; ADMIN-only; mirrors public tool list/filters/formats; uses admin hub APIs.
- [x] No download-profile dialog on the admin hub.
- [x] Admin submissions export entry remains distinct and unchanged.
- [x] Public + admin download-usage charts show six tools + “PDM (legacy)” for historical coarse events.
- [x] Admin downloaders/analytics UI can display improvement feedback; public dashboard never shows it.
- [x] Ports/adapters + component tests for hub and analytics labels / feedback visibility.

## Blocked by

- [`004-backend-public-admin-per-tool-download-apis.md`](./004-backend-public-admin-per-tool-download-apis.md)
- [`005-backend-download-usage-enum-and-improvement-feedback.md`](./005-backend-download-usage-enum-and-improvement-feedback.md)

## User stories addressed

- 18, 19, 21, 22, 23, 24, 25, 26, 27, 35

## Implemented

- Port/adapter: `IAdminToolDownloadApiPort` / `HttpAdminToolDownloadAdapter` → `GET /api/v1/admin/downloads/{dataset}/csv|excel` with Bearer JWT
- UI: `AdminDownloadHubPage` at `/admin/downloads`; Admin nav “Downloads” separate from “Download usage” and submissions export
- Analytics: `formatDatasetLabel` → six tools + `PDM (legacy)`; admin + public dataset charts; `DownloaderTable` improvement feedback column (admin only)
