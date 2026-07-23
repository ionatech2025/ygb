## Objective

Deliver **public dashboard aggregation APIs** for LGO Budget Allocation data (US-LGOB-02 / LGO-03, TC-LGOB-02-01): anonymised summary statistics and chart payloads for comparative visualisation across Local Governments / districts — no PII in responses.

## Architectural Context

- **Application Ports**:
  - Input (`api`): `GetLgoBudgetAllocationDashboardSummaryUseCase`, `GetLgoBudgetAllocationChartDataUseCase`.
  - Output (`spi`): `LgoBudgetAllocationReadRepositoryPort` — filtered aggregate queries (join `lgo_budget_allocations` → `submissions` → location/district).

- **Application Services**:
  - Apply public-dashboard filter model (district, sub-county, parish, date range, financial year) — reuse patterns from Epic 6/7 `AnonymisationProjector` / filter DTOs where applicable.
  - Project only anonymised dimensions: district labels, sector allocation aggregates, rationale/recommendation **themes or counts** (not raw free text with identifying details unless product confirms safe aggregation).

- **Adapters (REST)**:
  - `GET /api/v1/public/dashboard/lgo-budget-allocation/summary`
  - `GET /api/v1/public/dashboard/lgo-budget-allocation/charts/{chartType}`
  - `GET /api/v1/public/dashboard/lgo-budget-allocation/filters/options`
  - Spring Security: `permitAll()` on `/api/v1/public/dashboard/lgo-budget-allocation/**`.

## Technical Constraints & Clean Code

- **No PII:** Integration tests assert responses never contain phone numbers, LGO names, or collector identifiers.
- **Cross-district comparison:** At least one chart type compares allocation patterns or recommendation counts by district (TC-LGOB-02-01).
- **Performance:** Queries must remain acceptable for datasets up to NFR 5.1 scale (index on `submitted_at`, district FK paths).
- **Reuse:** Mirror Epic 7 budget-priority dashboard adapter structure for consistency.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Application Tests** with mocked read port for summary and chart use cases.
- [ ] Write **Controller Tests**: unauthenticated GET → `200` with anonymised payload; invalid filter → `400`.
- [ ] Write **Integration Tests** (Testcontainers): seed multiple districts → summary reflects cross-district counts; no PII fields in JSON.
- [ ] Document response DTO shapes in OpenAPI / `domain_arch_apis`.
- [ ] Implement read repository, use cases, controllers, mappers.

## Blocked by

- [001-backend-lgo-budget-allocation-domain-and-persistence.md](001-backend-lgo-budget-allocation-domain-and-persistence.md)
