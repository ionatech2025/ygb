## Parent PRD

None — standalone admin UX improvement (not part of the per-tool downloads PRD).

## What to build

Add **server-side pagination** (`page` / `size`, default `0` / `25`, max `100`) and matching UI footers for every admin table that still loads a full list:

1. **Manage Users** — data collectors list (`GET /api/v1/admin/users/data-collectors`)
2. **Collector Tracker leaderboard** — (`GET /api/v1/admin/collectors/leaderboard`)
3. **Sync status receipts by collector** — (`GET /api/v1/admin/sync/receipt-status` / `CollectorReceiptTable`)

Submissions list, collector profile submissions, and downloaders already paginate — leave them alone unless a shared pager component is extracted for consistency.

## Acceptance criteria

- [x] Each of the three APIs returns a page envelope (`items`, `page`, `size`, `totalElements` / equivalent existing page DTO shape used elsewhere).
- [x] Optional query params `page` and `size` with the same defaults/caps as other admin lists.
- [x] Frontend tables show page controls and fetch only the current page (no client-only slice of a full dump).
- [x] Empty pages and last-page edge cases behave correctly.
- [x] Backend controller/application tests for paging; frontend component tests for pager + page change.
- [x] Existing filters/sorts on those screens (if any) still apply **with** pagination (AND with page window).

## Blocked by

None — can start immediately (parallel to download work).

## User stories addressed

N/A — operational admin UX.
