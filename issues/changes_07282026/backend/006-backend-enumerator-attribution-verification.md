## Objective

**Verify** (through automated integration tests and a manual checklist) that every PDM form submission records **which data collector (enumerator) submitted it**, and that admins can see collector identity with form type and timestamp on the backend/admin UI.

Per the July 28 meeting this is a **test/confirmation item first** — implement code only if testing proves a gap.

Reference: [PDM_Tools_Change_Requests_07282026.md §1 item 1 & §6](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Architectural Context

- **Existing behaviour to confirm**
  - `SubmissionMetadata.collectorId` set from JWT on sync/submit.
  - Admin submission list/detail APIs expose collector id/name.

- **If gap found**
  - Fix in Application (`SubmitSubmissionService`) and REST adapter only — do not duplicate in domain.

## Acceptance Criteria & TDD Checklist

- [ ] Integration test: collector submits BYP → admin GET detail includes `collectorId` matching authenticated user.
- [ ] Integration test: repeat for IYP, LGO, PC.
- [ ] Manual checklist documented in issue comment or test plan: admin dashboard shows collector name, form type, submitted/synced time.
- [ ] If any form type missing attribution, open follow-up bug issue (do not expand scope here).

## Blocked by

None — can run in parallel with form changes.

## Related frontend issue

- [frontend/007-frontend-enumerator-attribution-verification.md](../frontend/007-frontend-enumerator-attribution-verification.md)
