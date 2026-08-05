## Objective

Expose **public, anonymised** download-usage aggregates for dashboard charts (downloads over time; comparison across PDM, Budget Priorities, and LGO).

## Architectural Context

- **Application:** aggregation queries over download events only (no profile PII in responses).
- **Adapters:** `/api/v1/public/dashboard/download-usage/**` (or under analytics); no auth.

## Technical Constraints & Clean Code

- Response DTOs must not include email, name, or other contact fields (contract test / schema assertion).
- Align time bucketing with existing public dashboard period conventions where practical.

## Acceptance Criteria & TDD Checklist

- [x] Public endpoint returns series suitable for “downloads over time”.
- [x] Public endpoint returns per-dataset comparison (PDM vs Budget Priorities vs LGO).
- [x] Controller/integration assertion: JSON has no PII keys.
- [x] No auth required.

## Blocked by

- [003-backend-gate-public-exports-and-record-download-events.md](003-backend-gate-public-exports-and-record-download-events.md)

## Related

- US-DL-05
