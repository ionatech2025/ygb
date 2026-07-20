## Objective

Implement the **collector submission count** display on the collector home/dashboard screen so Data Collectors can track their daily progress without contacting an Admin. This satisfies **US-FORM-13**.

The counter must:
1. Show the number of submissions made **today** (local device date), across all four form types combined.
2. Increment **immediately** on local enqueue (optimistic) — including offline-queued submissions not yet synced (TC-FORM-13-02).
3. Reset when the local device date changes to a new day (TC-FORM-13-03).
4. Optionally refresh from the server via `GET /api/v1/submissions/my-count` when online (backend issue 005).

> **Count source of truth**: Local IndexedDB pending + synced counts for today drive the UI. Server `my-count` is a reconciliation fallback when online — not the primary offline counter.

## Architectural Context

- **Frontend Primary Adapters — Components** (`src/adapters/primary/web/components/`):
  - `SubmissionCountBadge.tsx` — compact display for the collector header (e.g. "Today: 3").

- **Frontend Ports** (`src/ports/`):
  - Extend or add `ISubmissionStatsPort` with:
    - `countTodayLocal(): Promise<number>` — counts local queue entries + synced entries with `createdAt` on today's date.
    - `fetchServerDailyCount(): Promise<number>` — calls `GET /api/v1/submissions/my-count` with JWT.

- **Frontend Secondary Adapters** (`src/adapters/secondary/api/`):
  - `submission-stats.adapter.ts` — implements server count fetch against backend issue 005 endpoint.

- **Frontend Core** (`src/core/store/`):
  - Extend submission/sync store (Epic 4 `useSyncStore` from issue 013) OR add `useSubmissionCountStore.ts` with reactive `todayCount` that increments on enqueue events.

- **Frontend Application** (`src/App.tsx`):
  - Mount `SubmissionCountBadge` in the collector header alongside (or integrated with) `SyncStatusBar` from Epic 4 issue 014.

## Technical Constraints & Clean Code

- **Optimistic increment**: UI count must update synchronously on submit tap — do not await IndexedDB write (TC-FORM-13-02).
- **Daily reset**: Compare `createdAt` dates against `new Date()` local midnight boundary; do not rely on server timezone.
- **No Admin visibility**: This component renders only in the `DATA_COLLECTOR` layout branch.
- **File limits**: `SubmissionCountBadge.tsx` under 100 lines.

## Acceptance Criteria & TDD Checklist

- [x] Component test: badge shows "Today: 0" on fresh session.
- [x] Component test: after 3 local enqueues, badge shows "Today: 3" (TC-FORM-13-01).
- [x] Component test: offline enqueue increments count before sync completes (TC-FORM-13-02).
- [x] Unit test: date-boundary logic resets count when mocked date advances to next day (TC-FORM-13-03).
- [x] Integration test: when online, server count is fetched and displayed (or reconciled) without overwriting higher local count during active session.
- [x] Badge visible in collector header on all form screens.

## Blocked by

- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md) (local count source)
- Blocked by [epic-2-forms-and-submission/backend-issues/005-rest-adapter-collector-submission-count.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/backend-issues/005-rest-adapter-collector-submission-count.md) (server reconciliation endpoint)
- Blocked by [epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md) (recommended — shares `useSyncStore` for enqueue events; may proceed with a standalone store if 013 is not yet done)
