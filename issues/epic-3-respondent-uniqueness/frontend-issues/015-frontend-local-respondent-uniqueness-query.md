## Objective

Extend the offline submission store so the client can **query whether a respondent phone number has already been used for a given form type in the current financial-year period** (US-UNIQ-01). This is the local source of truth for duplicate detection before sync.

The check must consider all locally stored submissions for the device that are still "active" for uniqueness purposes:
- `PENDING` (queued, not yet synced)
- `SYNCED` (successfully pushed from this device)

Do **not** count `FAILED` entries unless product confirms otherwise.

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - Extend `PendingSubmission` with denormalised index fields (set at enqueue time):
    - `respondentPhone: string` (normalised via `normalizeUgandaPhoneLocal`)
    - `financialYearPeriod: string` (canonical key from issue 014, e.g. `JAN_JUN_2026`)

- **Frontend Ports** (`src/ports/`):
  - `respondent-uniqueness.port.ts` — `IRespondentUniquenessPort`:
    - `existsLocalDuplicate(formType, respondentPhone, financialYearPeriod, excludeDeviceSubmissionId?: string): Promise<boolean>`
    - `findLocalDuplicate(formType, respondentPhone, financialYearPeriod): Promise<PendingSubmission | null>` (optional helper for messaging)

- **Frontend Secondary Adapters** (`src/adapters/secondary/submission/`):
  - Bump Dexie schema version; add compound index fields: `respondentPhone`, `financialYearPeriod`.
  - Implement query in `SubmissionQueueAdapter` or a dedicated `RespondentUniquenessAdapter` that reads the same `YGBSubmissionDatabase`.
  - Update `enqueue` path (via `submitSurvey`) to populate the new denormalised fields from the payload + `deriveFinancialYearPeriod`.

## Technical Constraints & Clean Code

- **Phone normalisation**: Always compare normalised phones (same rules as `form-validation.ts` / backend).
- **Per form type**: BYP duplicate must not block IYP (TC-UNIQ-01-02).
- **Per FY period**: Same phone + same form in a different period must not match (TC-UNIQ-01-03).
- **Isolation**: Do not merge with `YGBAuthDatabase`.
- **Migration**: Dexie `version(n+1)` upgrade must not wipe existing queue data in dev/test.
- **File limits**: Adapter files under 200 lines.

## Acceptance Criteria & TDD Checklist

- [x] Dexie schema stores `respondentPhone` and `financialYearPeriod` on each queued record.
- [x] Adapter test (fake-indexeddb): after enqueueing BYP for `0772111222` in `JAN_JUN_2026`, `existsLocalDuplicate('BYP', '0772111222', 'JAN_JUN_2026')` returns `true`.
- [x] Adapter test: same phone + `IYP` in same period returns `false` (TC-UNIQ-01-02).
- [x] Adapter test: same phone + `BYP` in `JUL_DEC_2026` returns `false` (TC-UNIQ-01-03).
- [x] Adapter test: `FAILED` record does not trigger duplicate (if excluded by design).
- [x] `submitSurvey` populates denormalised fields on every new enqueue.

## Blocked by

- Blocked by [epic-3-respondent-uniqueness/frontend-issues/014-frontend-financial-year-period-domain.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-3-respondent-uniqueness/frontend-issues/014-frontend-financial-year-period-domain.md)
- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md) (base queue must exist)
