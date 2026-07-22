## Objective

Implement the **financial-year period** domain utility on the frontend, mirroring the backend `FinancialYearPeriod` value object. This is the shared time boundary used by all client-side respondent-uniqueness checks (US-UNIQ-01).

Financial-year periods:
- **Jan–Jun** → months 1–6 → canonical key `JAN_JUN_{year}`
- **Jul–Dec** → months 7–12 → canonical key `JUL_DEC_{year}`

The period is derived from the **device's local date/time** at the point of check (not server timezone).

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - `financial-year-period.model.ts` — type + helpers:
    - `FinancialYearPeriodKey` (e.g. `'JAN_JUN_2026'`)
    - `deriveFinancialYearPeriod(date?: Date): FinancialYearPeriod`
    - `formatFinancialYearPeriodLabel(period): string` — human label for error messages (e.g. `'Jan–Jun 2026'`)

- **Frontend Core** (`src/core/`):
  - `financial-year-period.ts` — pure functions only; no React, no IndexedDB.

> Must stay aligned with backend `FinancialYearPeriod.from(LocalDateTime)` in `backend/.../domain/valueobjects/FinancialYearPeriod.java` (`JAN_JUN` / `JUL_DEC` + calendar year, `toString()` = `PERIOD_YEAR`).

## Technical Constraints & Clean Code

- **No framework dependencies** in domain/core utilities.
- **Boundary parity**: Jan 1–Jun 30 and Jul 1–Dec 31 inclusive, using local calendar month/day (TC-UNIQ-01-03).
- **File limits**: Each file under 100 lines.

## Acceptance Criteria & TDD Checklist

- [x] Unit test: March 2026 → `JAN_JUN_2026` (TC-UNIQ-01-01 boundary).
- [x] Unit test: June 30 2026 → `JAN_JUN_2026`; July 1 2026 → `JUL_DEC_2026` (TC-UNIQ-01-03).
- [x] Unit test: August 2026 → `JUL_DEC_2026`.
- [x] Unit test: `formatFinancialYearPeriodLabel` returns `'Jan–Jun 2026'` and `'Jul–Dec 2026'` for UI messages (TC-UNIQ-01-04).
- [x] `toString()` / key format matches backend (`JAN_JUN_2026`, not `H1-2026` or similar).

## Blocked by

None — can start immediately.
