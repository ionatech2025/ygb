## Objective

Implement the offline-first submission store using **Dexie** (already installed). Every time a Data Collector taps "Submit" on any of the 4 survey forms, the submission must be written to **IndexedDB first**, before any network request is attempted. This satisfies US-SYNC-01: data is never lost due to connectivity.

This issue includes:
1. A new Dexie database class (`YGBSubmissionDatabase`) with a `pendingSubmissions` table (schema: `++id, formType, status, collectorId, deviceSubmissionId, createdAt, payload`).
2. A **secondary adapter** `SubmissionQueueAdapter` (in `src/adapters/secondary/`) implementing a port `ISubmissionQueuePort` with methods:
   - `enqueue(submission: PendingSubmission): Promise<number>` — writes to IndexedDB, returns the local ID.
   - `dequeueAll(): Promise<PendingSubmission[]>` — returns all entries with status `PENDING`.
   - `markSynced(localId: number): Promise<void>` — updates status to `SYNCED`.
   - `markFailed(localId: number, retryCount: number): Promise<void>` — updates status to `FAILED` and increments retry counter.
   - `countPending(): Promise<number>` — returns count of `PENDING` entries.
   - `getLastSyncedAt(): Promise<Date | null>` — returns the `syncedAt` timestamp of the most recently synced entry.
3. A port interface `ISubmissionQueuePort` in `src/ports/`.
4. A domain model `PendingSubmission` in `src/core/domain/` (fields: `localId`, `formType`, `collectorId`, `deviceSubmissionId`, `status: 'PENDING' | 'SYNCED' | 'FAILED'`, `retryCount`, `createdAt`, `syncedAt?`, `payload: object`).

The existing `YGBAuthDatabase` in `persistent-auth.adapter.ts` uses a separate Dexie database. Keep both databases isolated — **do not merge** them into one Dexie instance.

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - Add `pending-submission.model.ts` with `PendingSubmission` type and `SubmissionQueueStatus` enum/union.

- **Frontend Ports** (`src/ports/`):
  - Add `submission-queue.port.ts` declaring `ISubmissionQueuePort`.

- **Frontend Secondary Adapters** (`src/adapters/secondary/`):
  - Add `submission-queue.adapter.ts` containing `YGBSubmissionDatabase` (Dexie) and `SubmissionQueueAdapter` implementing `ISubmissionQueuePort`.

## Technical Constraints & Clean Code

- **Isolation**: Do not import from `persistent-auth.adapter.ts` into the submission queue adapter or vice versa.
- **File limits**: Keep `submission-queue.adapter.ts` under 200 lines. If the Dexie class and the adapter class grow large, split them into `submission-queue.db.ts` and `submission-queue.adapter.ts`.
- **No UI code**: This issue is pure infrastructure. No React components are modified.
- **DeviceSubmissionId**: Generate using `crypto.randomUUID()` at the point of enqueue, not at the point of final sync.

## Acceptance Criteria & TDD Checklist

- [x] `PendingSubmission` domain type exists with all required fields typed correctly.
- [x] `ISubmissionQueuePort` interface matches the method signatures above.
- [x] `SubmissionQueueAdapter` correctly implements all 6 methods.
- [x] Manual smoke test (browser DevTools → IndexedDB): after calling `enqueue(...)`, a record appears in the `pendingSubmissions` object store with `status: 'PENDING'`.
- [x] After `markSynced(id)`, the record's `status` updates to `'SYNCED'` and `syncedAt` is set.
- [x] `countPending()` returns 0 after all records are marked synced.
- [x] `getLastSyncedAt()` returns `null` when no records are synced, and the correct date after one is synced.

## Blocked by

- Blocked by [epic-4-offline-sync/frontend-issues/011-frontend-pwa-service-worker-setup.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/frontend-issues/011-frontend-pwa-service-worker-setup.md)
