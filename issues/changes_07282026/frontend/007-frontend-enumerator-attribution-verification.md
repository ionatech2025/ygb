## Objective

Execute a **manual and automated verification checklist** confirming admins can see which **enumerator (data collector)** submitted each PDM form, with form type and timestamp — across BYP, IYP, LGO, and PC.

Per July 28 meeting: confirm through testing first; only file bugs if attribution is missing.

Reference: [PDM_Tools_Change_Requests_07282026.md §1 item 1](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Checklist (manual QA)

- [ ] Log in as Data Collector → submit each of the four form types (or use seeded submissions).
- [ ] Log in as Admin → open submission list and detail for each form type.
- [ ] Confirm visible: **collector name/id**, **form type**, **submission/sync time**.
- [ ] Export (CSV/Excel) if applicable — confirm collector field present or intentionally anonymised per export type.

## Automated coverage

- [ ] E2E or integration test (frontend): admin submission detail page renders collector field from API fixture.
- [ ] Coordinate with [backend/006-backend-enumerator-attribution-verification.md](../backend/006-backend-enumerator-attribution-verification.md).

## Blocked by

None — can start immediately.

## Outcome

Document results in PR or comment. If pass → close issue. If fail → create targeted bug issue with screenshot and missing field name.
