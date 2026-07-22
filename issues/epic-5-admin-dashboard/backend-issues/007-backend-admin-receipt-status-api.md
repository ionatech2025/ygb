## Objective

Implement Admin visibility into **server-received submission status** (US-DASH-08 partial). The server only knows about submissions that have synced; device-side PENDING queues remain client-side (see `issues/require-polishing.md`).

This endpoint exposes:
- Counts of submissions by status (`SYNCED`, `FLAGGED`, `DUPLICATE`) globally and per collector.
- `lastReceivedAt` per collector for identifying stale activity.
- Optional: submissions with `FLAGGED` status older than N hours surfaced for follow-up.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `GetAdminReceiptStatusQuery`.
  - Output (`spi`): Extend `SubmissionRepositoryPort` with status histogram and per-collector last-sync queries.

- **REST**:
  - `GET /api/v1/admin/sync/receipt-status` — `{ totalSynced, totalFlagged, totalDuplicate, byCollector: [...] }`.
  - `ADMIN` role only.

## Technical Constraints & Clean Code

- **Do not claim device pending counts** in API or UI copy — document that PENDING is client-side only unless a future device heartbeat is added.
- Flag collectors with no `SYNCED` receipt in > 48 h as `stale` for admin attention (TC-DASH-08-02 approximation using server data).

## Acceptance Criteria & TDD Checklist

- [x] Integration test: status counts match seeded DB state (TC-DASH-08-01).
- [x] Integration test: collector with old `lastReceivedAt` flagged stale.
- [x] Controller test: `ADMIN` only.
- [x] Implement query, service, endpoint.

## Blocked by

- Blocked by [epic-5-admin-dashboard/backend-issues/001-backend-dashboard-aggregation-query-apis.md](001-backend-dashboard-aggregation-query-apis.md)
