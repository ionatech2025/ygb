## Objective

Provide **ADMIN** APIs for downloader listing (with PII) and graphical aggregates, filterable by **age bracket** and **gender**, plus visitor vs downloader comparison metrics.

## Architectural Context

- **Application:** query use cases over download profiles/events and visit events.
- **Adapters:** `/api/v1/admin/analytics/downloaders`, `/api/v1/admin/analytics/download-usage`, `/api/v1/admin/analytics/visits-vs-downloads` (names flexible); ADMIN role only.
- **Security:** never expose these under `/public/**`.

## Technical Constraints & Clean Code

- Age/gender filters mandatory in acceptance; country/field/dataset filters optional enhancements.
- Pagination for downloader table.
- MapStruct response DTOs; no domain leakage of persistence types.

## Acceptance Criteria & TDD Checklist

- [x] Unauthorized/non-admin → 401/403.
- [x] Downloader list includes email, optional name, country, gender, age, field of operation, download counts/timestamps.
- [x] Aggregate endpoints respect age + gender filters.
- [x] Visitors vs downloaders returns comparable series/totals for charting.
- [x] Application tests with mocked SPI; controller tests for filter query params.

## Blocked by

- [003-backend-gate-public-exports-and-record-download-events.md](003-backend-gate-public-exports-and-record-download-events.md)
- [004-backend-public-visit-beacon-api.md](004-backend-public-visit-beacon-api.md)

## Related

- US-DL-02, US-DL-03
