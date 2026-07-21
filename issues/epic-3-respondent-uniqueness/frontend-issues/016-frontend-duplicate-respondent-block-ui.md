## Objective

Wire **client-side respondent uniqueness validation** into the survey submit flow so Data Collectors cannot enqueue a duplicate respondent+form-type submission within the same financial-year period (US-UNIQ-01).

When blocked, the UI must show a **specific, actionable message** naming the form type and FY period — not a generic validation error (TC-UNIQ-01-04).

Example message:
> *BYP form already submitted for this respondent in Jan–Jun 2026.*

## Architectural Context

- **Frontend Core** (`src/core/`):
  - `respondent-uniqueness.validation.ts` — pure function:
    - `validateRespondentUniqueness({ formType, respondentPhone, completedAt? })` → `{ valid: true } | { valid: false, message: string }`
    - Uses `IRespondentUniquenessPort` (async) + issue 014 label formatter.

- **Frontend Core** (`src/core/submission-submit.service.ts`):
  - Call uniqueness validation **before** `recordSubmission()` / `enqueue`.
  - Throw or return a typed `DuplicateRespondentError` so forms can display the message without enqueueing.

- **Frontend Primary Adapters** (`src/adapters/primary/web/`):
  - Update all four form orchestrators (`BypForm`, `IypForm`, `LgoForm`, `PcForm`) to catch duplicate errors and render an inline alert on the respondent phone field + form-level banner.
  - Optionally extend `RespondentSection.tsx` with `error={errors.respondentPhone}` support (already present) — map duplicate message to `respondentPhone` error key for scroll-to-field behaviour.

- **Form type labels** (`src/core/domain/form-type.model.ts` or small map):
  - Display names: `BYP` → "BYP", etc. (match SRS wording in test cases).

## Technical Constraints & Clean Code

- **Check timing**: Run at **Submit** tap, after standard field validation passes (TC-UNIQ-01-01).
- **Optimistic count**: Do **not** increment `useSubmissionCountStore` when duplicate blocked.
- **Offline-first**: Local IndexedDB check only; server re-validation on sync remains backend responsibility (US-UNIQ-02).
- **No Admin UI** in this issue — flagged server-side duplicates are handled in the Admin Dashboard epic (US-DASH).
- **File limits**: Validation module under 100 lines; form diffs should reuse shared helper, not copy-paste across four forms.

## Acceptance Criteria & TDD Checklist

- [ ] Unit test: `validateRespondentUniqueness` returns invalid with message containing form type + period label when port returns duplicate (TC-UNIQ-01-04).
- [ ] Unit test: different form type allowed (TC-UNIQ-01-02).
- [ ] Unit test: different FY period allowed (TC-UNIQ-01-03).
- [ ] Integration test (`BypForm.test.tsx`): after mocking a local duplicate, submit is blocked and `submitSurvey` / enqueue is **not** called (TC-UNIQ-01-01).
- [ ] Integration test: non-duplicate submit still calls `submitSurvey` normally.
- [ ] Duplicate error is shown adjacent to phone field and/or as form alert; user can correct phone and resubmit.
- [ ] All four forms (BYP, IYP, LGO, PC) use the shared validation path.

## Blocked by

- Blocked by [epic-3-respondent-uniqueness/frontend-issues/015-frontend-local-respondent-uniqueness-query.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-3-respondent-uniqueness/frontend-issues/015-frontend-local-respondent-uniqueness-query.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/009-frontend-byp-form.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/009-frontend-byp-form.md) (forms must exist)
- Blocked by [epic-2-forms-and-submission/frontend-issues/010-frontend-iyp-form.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/010-frontend-iyp-form.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/011-frontend-lgo-form.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/011-frontend-lgo-form.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/012-frontend-pc-parish-chief-form.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/012-frontend-pc-parish-chief-form.md)
