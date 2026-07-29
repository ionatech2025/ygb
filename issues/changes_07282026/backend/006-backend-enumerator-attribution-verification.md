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

- [x] Integration test: collector submits BYP → admin GET detail includes `collectorId` matching authenticated user.
- [x] Integration test: repeat for IYP, LGO, PC.
- [x] Manual checklist documented in issue comment or test plan: admin dashboard shows collector name, form type, submitted/synced time.
- [x] If any form type missing attribution, open follow-up bug issue (do not expand scope here).

## Verification outcome (2026-07-29)

**Result: PASS — no code gaps found.** Existing behaviour correctly attributes submissions to the authenticated collector.

### Automated coverage

- `EnumeratorAttributionIntegrationTest` — persists BYP, IYP, LGO, and PC via `SubmitSubmissionService`, then asserts admin detail and list summaries expose `collectorId`, `collectorName` (`Default Collector`), `formType`, `formCompletedAt`, and `syncedAt`.
- `AdminSubmissionControllerTest` — REST contract asserts `collectorId`, `collectorName`, `formType`, and timestamps on list/detail DTOs.

### Manual QA checklist (admin dashboard)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Log in as **Data Collector** (`Default Collector` / seeded account) | Dashboard loads |
| 2 | Submit one of each form type (BYP, IYP, LGO, PC) — or use V13 seeded submissions | Submissions sync with status SYNCED |
| 3 | Log in as **Admin** → Admin → Submissions list | Each row shows **collector name**, **form type**, **form completed** and **synced** timestamps |
| 4 | Open submission detail for each form type | Detail header shows **collector name/id**, **status**, **form completed at**, **synced at**, and full payload |
| 5 | Export CSV/XLSX (admin submissions export) | **Collector name** column present (PII by design for admin exports; public export excludes collector PII) |

No follow-up bug issues required.

## Blocked by

None — can run in parallel with form changes.

## Related frontend issue

- [frontend/007-frontend-enumerator-attribution-verification.md](../frontend/007-frontend-enumerator-attribution-verification.md)
