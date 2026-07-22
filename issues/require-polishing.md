# Require Polishing — Backlog

Unresolved gaps, UX rough edges, and audit items discovered during Epic 4 completion. Ordered by priority.

---

## P1 — High (blocks realistic offline field use)

### Offline login fallback when network unavailable

**Symptom:** With DevTools offline (or no connectivity), login shows **“Failed to fetch”** unless the collector already has a cached offline profile in `YGBAuthDatabase`.

**Expected:** If credentials were previously used on this device, allow offline login from cache; if online login fails due to network error, show a clear “You are offline — sign in with saved credentials” path instead of a generic fetch error.

**Likely touchpoints:**
- `frontend/src/adapters/secondary/api/persistent-auth.adapter.ts`
- `frontend/src/core/store/useAuthStore.ts`
- `CollectorLogin.tsx` / `PortalLogin.tsx`

**Related user stories:** US-SYNC-01 (local-first), Epic 1 auth offline behaviour.

---

## P2 — Medium (correctness / maintainability)

### Epic 2 backend issue checklists not audited

Several Epic 2 backend issues (`001`–`005`) still show unchecked TDD boxes despite substantial implementation. Run a test audit and update issue markdown to match reality (same pass applied to Epic 4 `009` in this session).

**Files:** `issues/epic-2-forms-and-submission/backend-issues/*.md`

### `CascadingLocationSelector` React `act(...)` warnings in tests

Multiple form/respondent tests log `act(...)` warnings when location data loads asynchronously. Tests pass but output is noisy; wrap async location load or mock `locationService.ensureLoaded()` in shared test setup.

**Files:** `RespondentSection.test.tsx`, `BypForm.test.tsx`, `PcForm.test.tsx`, `LgoForm.test.tsx`, `PDMSurveyView.test.tsx`

### Admin pending-sync queue (US-DASH-08) — scope clarification

Server only sees **SYNCED** submissions. Device **PENDING** queue depth is client-side (IndexedDB). Epic 5 issue `006-backend-admin-receipt-status-api.md` documents server-side receipt metrics; true cross-device pending visibility may need a future “last-seen heartbeat” or explicit device sync report — do not over-promise in UI copy.

---

## P3 — Low (nice-to-have / future)

### Service Worker Background Sync tag (`submit-pending`)

Epic 4 issue 013 lists optional SW `sync` event registration. Primary path (`window.online` → `triggerSync`) works; SW background sync while app is closed is not implemented.

**File:** `frontend/src/workbox-config.ts`, custom SW handler if added.

### Expand Uganda location dataset beyond Kampala + Ntungamo

Current seed covers two districts (~1,549 nodes). Full national dataset requires additional source JSON files and re-running `backend/scripts/build-admin-locations.mjs`.

### BypForm / PcForm / LgoForm integration test timeouts

Submit-path tests run 5–18 s each due to cascading location interaction. Consider shared `fillRespondentLocation()` test helper to reduce duplication and flakiness.

---

## Completed in this pass

- [x] Epic 4 `009-backend-location-dataset-endpoint.md` checklist audited — all criteria implemented and tested.
- [x] Flyway location seed migration renumbered to `V9__Seed_Kampala_Ntungamo_Admin_Locations.sql` (avoids conflict with `V8__Add_Lgo_Governance_Questions.sql`).
