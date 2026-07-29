## Objective

Apply **cross-cutting domain and API changes** requested on 28 July 2026 to all four PDM collector tools (BYP, IYP, LGO, PC):

1. Make **respondent name optional** (nullable/blank allowed; no longer a submission invariant).
2. **Remove `exactAge`** from BYP — age is captured only via age brackets.
3. **Redefine age brackets** to match the programme target (18–35):
   - Below 18 (out of scope — reject or flag; no child-protection workflow)
   - 18–24
   - 25–29
   - 30–35
   - Above 35 (outlier/spillover)

Reference: [PDM_Tools_Change_Requests_07282026.md §1 items 2–4](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Architectural Context

- **Core Domain**
  - Update `AgeGroup` enum labels/values to the new bracket set.
  - Relax `Submission` base constructor validation for blank `respondentName`.
  - Remove `Age exactAge` from `BypSubmission`; drop `Age` VO usage for BYP where no longer needed.
  - Update under-age rules: previous ≥15 rule replaced by bracket policy (Below 18 rejected or stored as out-of-scope per product decision — default: **reject submit** with clear error).

- **Application**
  - Update `BypSubmitCommand`, mappers, and `SubmitSubmissionService` to stop requiring `exactAge`.

- **Adapters**
  - Update `BypSubmissionRequestDto`, JPA entity, MapStruct mappers, Flyway migration to drop `exact_age` column (or deprecate with nullable column + migration).
  - Relax validation on `respondentName` in REST DTOs for all four form types.

## Technical Constraints & Clean Code

- Flyway migration must handle existing BYP rows (nullable `exact_age` or drop after backfill not needed).
- Dashboard/export mappers must not assume `exactAge` on BYP payloads.
- Keep files under 500 lines; domain tests first (TDD).

## Acceptance Criteria & TDD Checklist

- [x] Domain test: `Submission` accepts null/blank `respondentName`.
- [x] Domain test: new `AgeGroup` values cover Below 18, 18–24, 25–29, 30–35, Above 35.
- [x] Domain test: BYP submission rejects Below 18 bracket (or documents accepted storage if client prefers capture-only).
- [x] Domain test: `BypSubmission` no longer requires or exposes `exactAge`.
- [x] Application test: submit BYP without `exactAge` succeeds with valid payload.
- [x] Adapter test: POST BYP without `exactAge` returns 201/200; blank `respondentName` accepted.
- [x] Migration applied; existing integration tests updated.

## Blocked by

None — can start immediately.

## Related frontend issue

- [frontend/001-frontend-cross-cutting-respondent-age-bracket-changes.md](../frontend/001-frontend-cross-cutting-respondent-age-bracket-changes.md)
