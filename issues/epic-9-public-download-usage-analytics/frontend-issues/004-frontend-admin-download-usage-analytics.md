## Objective

Add an **admin** analytics view: downloader table (PII), charts filterable by age bracket and gender, and visitors vs downloaders comparison.

## Architectural Context

- **Primary adapters:** admin route/section under existing admin shell.
- **Secondary adapters:** admin analytics API client (005).

## Technical Constraints & Clean Code

- ADMIN-only route guard.
- Reuse dashboard chart patterns/theme where practical; keep admin chrome (not public theme).
- Table supports pagination; filters for age + gender required.

## Acceptance Criteria & TDD Checklist

- [x] Admin can open usage analytics and see downloader rows with email/optional name.
- [x] Changing age/gender filters refreshes charts/table.
- [x] Visitors vs downloaders chart/section renders from API data.
- [x] Non-admin cannot access the route (redirect/forbidden).

## Blocked by

- Backend [005](../backend-issues/005-backend-admin-download-usage-analytics-apis.md)
- [003-frontend-public-visit-beacon.md](003-frontend-public-visit-beacon.md) (for meaningful visitor data in env)

## Related

- US-DL-02, US-DL-03
