## Objective

Add a collector Field-app screen so a Data Collector can see **how much they have submitted** (totals by form type), without asking Admin — matching the admin collector form-type breakdown, not a per-interview or district detail list.

## Architectural Context

- **Frontend ports**: `ICollectorSubmissionsApiPort` (`fetchMineBreakdown`; list `fetchMine` retained for admin/other use).
- **Secondary adapter**: HTTP `GET /api/v1/submissions/mine/breakdown` with bearer token.
- **Primary adapters**: collector route under `CollectorLayout` (`/collector/submissions`); entry from Field dashboard.
- **Local queue**: compact “waiting to sync” count banner (no per-respondent detail rows).

## Technical Constraints & Clean Code

- Hexagonal: UI does not call `fetch` directly; inject the port in tests.
- Preserve collector chrome (`max-w-lg`, existing tokens — not admin modal chrome).
- Do not expose other collectors’ data. Token + backend scoping is the source of truth.
- Read-only; no edit/resubmit.
- Out of scope: public Budget Priorities detail lists.

## Acceptance Criteria & TDD Checklist

- [x] Collector can open history from the Field dashboard and see a **breakdown** (total, form types with %).
- [x] Totals show how many submissions are on the server plus pending local count.
- [x] Pending local queue is shown as a compact waiting-to-sync summary (not a full interview list).
- [x] Page does **not** list individual respondent/submission detail rows.
- [x] Page does **not** show district breakdown (collector-irrelevant).
- [x] Server totals/form types load via `GET /api/v1/submissions/mine/breakdown` (DB-backed).
- [x] Non-collector cannot open the route (existing `ProtectedRoute` `DATA_COLLECTOR`).
- [x] Component tests with mocked breakdown API + mocked queue; route guard covered.

## Blocked by

- [x] [001-backend-collector-own-submissions-history-api.md](001-backend-collector-own-submissions-history-api.md) (plus `GET /mine/breakdown`)

## Related

- US-FORM-13 · Field dashboard today count / sync pending · Admin collector performance breakdown
