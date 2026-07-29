## Objective

Implement an **admin-controlled “current fiscal year”** for the Local Government Official (LGO) PDM tool so enumerators report against the fiscal year the admin selects for the active data-collection round — not an arbitrary year per submission.

Reference: [PDM_Tools_Change_Requests_07282026.md §4](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md) and [lgo_questions.md](../../docs/suggested_changes/07282026/lgo_questions.md).

## Architectural Context

- **Core Domain**
  - Value object or settings record: `ActiveFiscalYearSetting` (label e.g. `2025/26`, effective from timestamp, set by admin user id).
  - Extend `LgoFiscalYearCatalog` (or replace static list ordering) so **current admin-selected year sorts first**.

- **Application**
  - `GetActiveFiscalYearUseCase` — read current setting (default to latest supported label if unset).
  - `SetActiveFiscalYearUseCase` — ADMIN only; validates label against catalog.

- **Adapters**
  - Persistence: settings table or key-value row (e.g. `app_settings` / `pdm_collection_settings`).
  - REST: `GET /api/v1/admin/settings/fiscal-year`, `PUT /api/v1/admin/settings/fiscal-year` (ADMIN).
  - Public/collector read: `GET /api/v1/public/settings/fiscal-year` or include in existing config endpoint (no auth required for label only).

## Technical Constraints & Clean Code

- Do **not** hard-code a static fiscal year in the LGO form backend — admin must update without redeploy.
- Thin controllers; MapStruct for DTO mapping.
- TDD: application tests with mocked repository port.

## Acceptance Criteria & TDD Checklist

- [ ] Domain/application test: invalid fiscal year label rejected on set.
- [ ] Application test: get returns last admin-set value.
- [ ] Adapter test: ADMIN can set; DATA_COLLECTOR receives 403 on PUT.
- [ ] Adapter test: GET returns current label for collector app bootstrap.
- [ ] Flyway migration creates settings storage with sensible default (`2025/26` or latest in catalog).

## Blocked by

None — can start immediately.

## Related frontend issue

- [frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md](../frontend/005-frontend-lgo-fiscal-year-admin-lock-and-two-year-comparison.md)

## Blocked by this issue

- [003-backend-lgo-two-year-comparison-and-gender-split.md](003-backend-lgo-two-year-comparison-and-gender-split.md)
