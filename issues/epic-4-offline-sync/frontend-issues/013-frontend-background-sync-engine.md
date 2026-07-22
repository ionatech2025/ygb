## Objective

Implement the background sync engine that automatically pushes `PENDING` submissions from IndexedDB to the server (`POST /api/v1/submissions`) whenever the device has connectivity. This satisfies US-SYNC-02 and US-SYNC-04 (auto-sync on reconnect, oldest-first ordering, exponential back-off on failure, in-app failure notification).

This issue delivers:
1. A **`SyncEngine`** class (in `src/core/`) responsible for:
   - Reading all `PENDING` entries from `ISubmissionQueuePort` (sorted oldest-first by `createdAt`).
   - POSTing each to the server via an **`ISubmissionApiPort`** (see below).
   - On success: calling `markSynced(localId)`.
   - On failure: calling `markFailed(localId, retryCount)` and scheduling a retry with exponential back-off (initial delay 5 s, doubling each failure, max 5 min cap).
   - Emitting sync state events so the UI (issue `014`) can reactively update.

2. An **`ISubmissionApiPort`** in `src/ports/` with one method: `syncSubmission(submission: PendingSubmission): Promise<void>` (throws on non-2xx).

3. A **`HttpSubmissionApiAdapter`** in `src/adapters/secondary/` implementing `ISubmissionApiPort` using `fetch`, sending the JWT access token from `useAuthStore`.

4. A **`useSyncStore`** Zustand store in `src/core/store/` exposing:
   - `isOnline: boolean`
   - `pendingCount: number`
   - `lastSyncedAt: Date | null`
   - `lastSyncError: string | null`
   - `triggerSync(): void` — manually initiates a sync cycle (also called automatically on reconnect).

5. **Connectivity detection**: listen to `window.addEventListener('online', ...)` and `'offline'` events to update `isOnline` and trigger sync automatically on reconnect.

6. **Service Worker Background Sync** (optional enhancement if platform supports it): register a `sync` event tag `'submit-pending'` in the Service Worker. If the app is closed when connectivity returns, the SW fires the sync event and re-triggers the sync engine. This is a best-effort enhancement; the primary path is the `online` event listener.

## Architectural Context

- **Frontend Domain** (`src/core/`):
  - `SyncEngine.ts` — pure TypeScript class (no React). Depends on `ISubmissionQueuePort` and `ISubmissionApiPort` via constructor injection.

- **Frontend Ports** (`src/ports/`):
  - `submission-api.port.ts` — `ISubmissionApiPort`.

- **Frontend Secondary Adapters** (`src/adapters/secondary/`):
  - `http-submission-api.adapter.ts` — `HttpSubmissionApiAdapter`.

- **Frontend Store** (`src/core/store/`):
  - `useSyncStore.ts` — Zustand store. Instantiates `SyncEngine` and wires connectivity listeners. Exported hook for UI consumption.

## Technical Constraints & Clean Code

- **No React in `SyncEngine`**: The sync engine must be a plain TypeScript class with no React hooks or JSX. UI reactivity is achieved by the Zustand store calling `SyncEngine` and updating store state.
- **Retry cap**: Maximum back-off delay must not exceed 5 minutes (300,000 ms).
- **Token handling**: `HttpSubmissionApiAdapter` must read the access token from the Zustand auth store at call time (not at adapter construction time) to handle token refresh correctly.
- **File limits**: Keep each file under 200 lines. If `SyncEngine` grows, extract the retry scheduler into `sync-retry-scheduler.ts`.

## Acceptance Criteria & TDD Checklist

- [x] `useSyncStore` initialises with `pendingCount: 0`, `lastSyncedAt: null` (`isOnline` lives in `useAuthStore`; connectivity wired in `AppRouter`).
- [x] Toggling browser to offline updates online status to `false` within 2 seconds.
- [x] Toggling back to online triggers `triggerSync()` automatically and processes any pending entries.
- [x] On successful sync of all entries, `pendingCount` drops to `0` and `lastSyncedAt` is updated.
- [x] When `ISubmissionApiPort.syncSubmission` throws (simulated server error), the entry remains `PENDING`, `lastSyncError` is set.
- [x] Retry delay sequence is 5 s → 10 s → 20 s → 40 s → … capped at 300 s (via `sync-retry-scheduler.ts`).
- [x] Entries are processed oldest-first (verified by `createdAt` ordering).

## Blocked by

- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
