## Objective

Build the persistent **sync status indicator** UI component and wire the actual PDM survey form submission flow so that:
1. Tapping "Submit Survey Payload" in `PDMSurveyView.tsx` enqueues the submission to IndexedDB and immediately triggers a sync attempt.
2. A visible **`SyncStatusBar`** component displayed at the top of the collector's screen always shows: connection state (Online/Offline), count of pending-sync submissions, and the last successful sync timestamp.
3. A **`SyncFailedToast`** appears briefly when a sync attempt fails, informing the collector without blocking the UI.

This satisfies US-SYNC-01 (local save on submit), US-SYNC-03 (visible status), and US-SYNC-04 (failure notification).

### Sub-tasks

**A — SyncStatusBar component**
- Location: `src/adapters/primary/web/components/SyncStatusBar.tsx`
- Reads `isOnline`, `pendingCount`, `lastSyncedAt` from `useSyncStore`.
- Displays:
  - A coloured dot (green = online, red = offline) with text "Online" / "Offline".
  - "Pending: N" where N is `pendingCount` (hidden when 0).
  - "Last synced: HH:MM" where applicable (hidden when `lastSyncedAt` is null).
- Updates reactively — no polling.

**B — SyncFailedToast component**
- Location: `src/adapters/primary/web/components/SyncFailedToast.tsx`
- Subscribes to `lastSyncError` from `useSyncStore`.
- Auto-dismisses after 5 seconds.
- Only renders when `lastSyncError !== null`.

**C — PDMSurveyView submission wiring**
- Replace the placeholder `PDMSurveyView.tsx` submit button with a functional form that:
  - Delegates to the full form components built in Epic 2 ([009 BYP](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/009-frontend-byp-form.md), [010 IYP](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/010-frontend-iyp-form.md), [011 LGO](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/011-frontend-lgo-form.md), [012 PC](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/012-frontend-pc-parish-chief-form.md)) once available; until then, wire submit through the shared foundation from [006](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md).
  - On submit: calls `enqueue(submission)` from `ISubmissionQueuePort` (retrieved via the `useSyncStore`'s sync engine or directly injected).
  - Updates the `pendingCount` in the store immediately (optimistic update).
  - Shows a brief "Saved locally" confirmation.
  - Triggers `triggerSync()`.

**D — Layout integration**
- Mount `SyncStatusBar` inside the collector header in `App.tsx` (the `header` element in the `DATA_COLLECTOR` route gate branch).
- Mount `SyncFailedToast` at the root level of the collector layout so it can appear above all other content.

## Architectural Context

- **Frontend Primary Adapters** (`src/adapters/primary/web/components/`):
  - `SyncStatusBar.tsx`
  - `SyncFailedToast.tsx`

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/`):
  - `PDMSurveyView.tsx` — updated submission logic.

- **Frontend Application** (`src/App.tsx`):
  - Integrate `SyncStatusBar` and `SyncFailedToast` into the collector layout branch.

## Technical Constraints & Clean Code

- **File limits**: `PDMSurveyView.tsx` must remain under 200 lines. If the full form grows beyond this, extract field groups into sub-components in a local `forms/byp/` directory.
- **SRP**: `SyncStatusBar` only reads from `useSyncStore`. It must not directly call `ISubmissionQueuePort` or the sync engine.
- **No inline styles**: Use Tailwind CSS classes consistently with the existing design system (slate/green colour scheme as seen in `App.tsx`).
- **Optimistic UI**: The pending count must increment **immediately** on submit tap — do not wait for the IndexedDB write to complete before updating the UI.

## Acceptance Criteria & TDD Checklist

- [x] `SyncStatusBar` renders an "Offline" indicator when `isOnline = false`.
- [x] `SyncStatusBar` renders "Online" and hides "Pending" badge when `pendingCount = 0`.
- [x] `SyncStatusBar` shows "Pending: 3" when `pendingCount = 3`.
- [x] `SyncStatusBar` shows "Last synced: HH:MM" after a successful sync.
- [x] `SyncFailedToast` appears when `lastSyncError` is set and auto-dismisses after 5 s.
- [x] Tapping the PDMSurveyView submit button writes a record to IndexedDB (verify via browser DevTools).
- [x] After submit, the pending count in `SyncStatusBar` increments immediately.
- [x] When online, the sync engine automatically attempts to push the queued submission to the server within a few seconds.

## Blocked by

- Blocked by [epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/issues/epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md)
