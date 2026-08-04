## Objective

Show **public** anonymised charts for how widely open data is downloaded — over time and comparing PDM vs Budget Priorities (and LGO), with no personal data.

## Architectural Context

- **Primary adapters:** section on public dashboard (or dedicated panel) using public theme.
- **Secondary adapters:** public download-usage API (006).

## Technical Constraints & Clean Code

- No admin table, emails, or names.
- Presentation-quality charts consistent with Epic 6 public visuals.

## Acceptance Criteria & TDD Checklist

- [ ] Public user sees downloads-over-time chart from API.
- [ ] Public user sees dataset comparison (PDM vs Budget Priorities vs LGO).
- [ ] Rendered UI/copy does not surface PII fields from fixtures.
- [ ] Section loads without login.

## Blocked by

- Backend [006](../backend-issues/006-backend-public-download-usage-aggregation-apis.md)

## Related

- US-DL-05
