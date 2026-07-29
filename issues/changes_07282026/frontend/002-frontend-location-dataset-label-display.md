## Objective

Ensure location **cascading dropdowns** display corrected parish/sub-county/village labels after the backend dataset migration, and that offline-cached datasets refresh when the ETag changes.

Reference: [PDM_Tools_Change_Requests_07282026.md §1 item 6](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Architectural Context

- **Frontend**
  - `LocationService` / location dataset adapter — no code change if ETag-driven refresh already works; add test proving reload on new ETag.
  - Verify Kampala + Ntungamo dropdowns show corrected labels in component tests with fixture dataset.

## Acceptance Criteria & TDD Checklist

- [x] Unit test: location service refetches when API ETag changes.
- [x] Component test: parish dropdown renders corrected label from updated fixture (spot-check known fix).
- [ ] Manual QA: compare dropdown labels against client-approved list.

## Blocked by

- [backend/005-backend-location-dataset-naming-corrections.md](../backend/005-backend-location-dataset-naming-corrections.md)
