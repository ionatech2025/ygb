## Objective

Execute a **manual and automated verification checklist** confirming admins can see which **enumerator (data collector)** submitted each PDM form, with form type and timestamp — across BYP, IYP, LGO, and PC.

Per July 28 meeting: confirm through testing first; only file bugs if attribution is missing.

Reference: [PDM_Tools_Change_Requests_07282026.md §1 item 1](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Checklist (manual QA)

- [x] Log in as Data Collector → submit each of the four form types (or use seeded submissions).
- [x] Log in as Admin → open submission list and detail for each form type.
- [x] Confirm visible: **collector name/id**, **form type**, **submission/sync time**.
- [x] Export (CSV/Excel) if applicable — confirm collector field present or intentionally anonymised per export type.

## Automated coverage

- [x] E2E or integration test (frontend): admin submission detail page renders collector field from API fixture.
- [x] Coordinate with [backend/006-backend-enumerator-attribution-verification.md](../backend/006-backend-enumerator-attribution-verification.md).

## Blocked by

None — can start immediately.

## Outcome

**Result: PASS — no attribution gaps found.** Admin UI and API adapter expose enumerator identity for all form types.

### Automated coverage added

- `SubmissionDetailView.test.tsx` — collector name, collector ID, form type, and timestamps for BYP, IYP, LGO, PC fixtures.
- `SubmissionDrillDown.test.tsx` — list row shows collector name; detail page renders collector name/id and sync timestamps from API fixture.
- `submission-admin-api.adapter.test.ts` — admin detail response maps `collectorId`, `collectorName`, `formType`, and timestamps.

### UI note

- Submission list: **Collector** column shows collector name; **Form type** and **Completed** columns show form type and completion time.
- Submission detail: **Provenance & sync** section shows collector name, collector ID, form type, completed at, and synced at.
- Admin CSV/XLSX/PDF export includes collector name (backend export writers); public export excludes collector PII by design.

### Manual QA checklist (admin)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Log in as **Data Collector** and submit BYP, IYP, LGO, PC (or use V13 seeded data) | Submissions sync to server |
| 2 | Log in as **Admin** → Submissions list | Each row shows collector name, form type, completed time, status |
| 3 | Open detail for each form type | Provenance section shows collector name + ID, form type, completed/synced timestamps |
| 4 | Export CSV/XLSX from submissions list | File includes collector name column (admin-only export) |

No follow-up bug issues required.
