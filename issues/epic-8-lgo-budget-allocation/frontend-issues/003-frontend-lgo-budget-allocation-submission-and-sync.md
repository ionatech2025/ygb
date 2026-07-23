## Objective

Wire **LGO Budget Allocation submission** through the collector **offline-first queue** (US-LGOB-01 + Epic 4 sync): enqueue on submit, sync when online, success/error feedback, and integration with `SyncStatusBar` / submission count — matching PDM collector form patterns.

## Architectural Context

- **Integration**:
  - On submit: build payload → `ISubmissionQueuePort.enqueue()` with form type `LGO_BUDGET_ALLOCATION` (or agreed discriminator).
  - Trigger `useSyncStore.triggerSync()` after enqueue.
  - Map API errors (400/409/5xx) to user-visible messages.

- **Components**:
  - Extend `LgoBudgetAllocationForm.tsx` with submit flow (loading state, disabled button, scroll-to-error).
  - `LgoBudgetAllocationSuccessBanner.tsx` — “Saved locally / Submitted” confirmation (reuse toast/banner patterns from Epic 2 forms).

- **Sync engine**:
  - Ensure background sync engine routes queued `LGO_BUDGET_ALLOCATION` items to `POST /api/v1/submissions/lgo-budget-allocation`.

## Technical Constraints & Clean Code

- **US-SYNC-01:** Data never lost — IndexedDB write before network attempt.
- **Idempotency:** Pass stable `deviceSubmissionId` for replay safety.
- **401 handling:** Expired token → prompt re-login without dropping queued item.
- **No public queue:** Unlike Budget Priorities, this form never uses public online-only submit.

## Acceptance Criteria & TDD Checklist

- [ ] Unit test: enqueue payload includes `deviceSubmissionId` and form discriminator.
- [ ] Component test: submit enqueues locally and shows “Saved locally” when offline (mock queue).
- [ ] Component test: online submit triggers sync store `triggerSync`.
- [ ] Integration test (or sync engine unit test): queued item maps to correct API endpoint.
- [ ] Manual test checklist: airplane mode → submit → item pending → online → synced.
- [ ] Implement submit wiring, success UI, and sync engine route registration.

## Blocked by

- [002-frontend-lgo-budget-allocation-form.md](002-frontend-lgo-budget-allocation-form.md)
- Epic 4 [012-frontend-indexeddb-submission-queue.md](../../epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
- Epic 4 [013-frontend-background-sync-engine.md](../../epic-4-offline-sync/frontend-issues/013-frontend-background-sync-engine.md)
- Backend [002-backend-lgo-budget-allocation-submission-api.md](../backend-issues/002-backend-lgo-budget-allocation-submission-api.md)
