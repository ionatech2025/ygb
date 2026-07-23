## Objective

Implement **aggregated Budget Priorities read APIs** for the public dashboard (US-BP-02 / BP-04): anonymised summary statistics and chart series by sector, filterable by section and shared public dashboard dimensions (district, demographics, FY period, date range) — **never exposing phone numbers or respondent names** (TC-BP-02-01).

## Architectural Context

- **Core Domain** (`domain/dashboard/` or `domain/budgetpriority/read/`):
  - `BudgetPriorityDashboardFilter` — section (required or optional “all sectors”), district, sub-county, parish, age group, gender, financial year period, date range; AND semantics.
  - Read models: `BudgetPrioritySummary` (totals by sector, top priority areas), `BudgetPriorityChartSeries` (e.g. priority-area distribution, submissions over time).
  - Reuse or extend `AnonymisationProjector` — public BP responses must strip phone/name; aggregate counts only.

- **Application Ports**:
  - Input (`api`): `GetBudgetPrioritySummaryQuery`, `GetBudgetPriorityChartsQuery`.
  - Output (`spi`): `BudgetPriorityDashboardReadPort` — SQL/aggregation queries over `budget_priority_submissions`.

- **Application Services**:
  - `GetBudgetPrioritySummaryService`, `GetBudgetPriorityChartsService` — wired in `UseCaseConfig`.

- **Adapters (REST)** — extend `PublicDashboardController` or add `BudgetPriorityDashboardController`:
  - `GET /api/v1/public/dashboard/budget-priorities/summary?section=&districtId=&...`
  - `GET /api/v1/public/dashboard/budget-priorities/charts/{chartType}` where `chartType` ∈ `{by-priority-area, by-sector, over-time}` (document exact set in OpenAPI).
  - `GET /api/v1/public/dashboard/budget-priorities/filters/options` — distinct filter values for BP dataset (no PII).

## Technical Constraints & Clean Code

- **PII guard (TC-PUB-01-03 parity):** Contract tests assert response JSON never contains `phone`, `fullName`, `phoneNumber`, or raw `demographic_data` blobs.
- **Reuse Epic 6 patterns:** Mirror `PublicDashboardFilter` mapping and filter-options structure from [001-backend-public-dashboard-security-and-filter-model.md](../../epic-6-public-dashboard/backend-issues/001-backend-public-dashboard-security-and-filter-model.md).
- **Empty state:** Zero submissions → `200` with empty aggregates, not `404`.
- **Performance:** Target dashboard chart render NFR (< 4s for 50k rows applies to combined dataset; index `submitted_at`, `section`, `financial_year_period`).

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** for `BudgetPriorityDashboardFilter` validation.
- [ ] Write **Domain Tests** for anonymised projection — sample row with PII → public DTO has no PII fields.
- [ ] Write **Application Tests** with mocked read port — summary and chart queries pass filter correctly.
- [ ] Write **Controller Tests**:
  - Unauthenticated GET → `200`.
  - Response keys never match PII deny-list.
  - Filter by section returns sector-scoped counts (TC-BP-02-01).
- [ ] Write **Integration Test** with seeded submissions: summary totals match DB counts.
- [ ] Implement filter model, read port, services, REST endpoints, Flyway indexes if needed.

## Blocked by

- [001-backend-budget-priority-domain-and-persistence.md](001-backend-budget-priority-domain-and-persistence.md) — table must exist with seedable data.
- [002-backend-budget-priority-submission-api.md](002-backend-budget-priority-submission-api.md) — recommended before meaningful aggregation tests (can use fixtures in isolation).
