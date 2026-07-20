## Objective

Implement the full **Beneficiary Young Person (BYP)** survey form UI with all fields, conditional logic, and client-side validation. On valid submit, build a `BypSubmissionPayload` matching `BypSubmissionRequestDto` and hand off to the submission queue (Epic 4). This satisfies **US-FORM-02**.

## Architectural Context

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/byp/`):
  - `BypForm.tsx` — main form component (orchestrates sections, submit handler).
  - `BypFundSection.tsx` — Q1–Q4 (fund receipt duration, amount, instalment period).
  - `BypRatingSection.tsx` — Q5–Q7 (service rating, performance rating, transparency).
  - `BypBdsSection.tsx` — Q8 multi-select (training / market linkages / extension service).
  - `BypFeedbackSection.tsx` — Q9 improvement suggestion (narrative).

- **Shared dependencies**:
  - `RespondentSection` from issue 008 (includes exact age field for BYP).
  - Shared components from issue 006 (`RatingSelect`, `MultiCheckboxGroup`, `NarrativeTextarea`, `YesNoRadioGroup`, `useConditionalFields`).

- **Payload mapping**:
  - Output must include `formType: 'BYP'` and all fields from `backend/.../dto/BypSubmissionRequestDto.java`.

## Field & conditional rules (from US-FORM-02)

| Field | Conditional rule |
|-------|-----------------|
| `fundReceiptDurationSpecify` | Required when Q1 is a duration option that includes "specify" (e.g. Months) |
| `instalmentPeriodSpecify` | Required when Q4 instalment period = Other |
| `bdsServices` (multi-select) | Visible and required only when `receivedBds = true`; hidden when false |
| `exactAge` | Required; must be ≥ 15 (US-FORM-10) |
| `serviceRating`, `performanceRating` | Rating scale only — no free text (TC-FORM-02-05) |
| `improvementSuggestion` | Narrative; ≥ 10 chars when provided (US-FORM-12) |

## Technical Constraints & Clean Code

- **Submit flow**: On valid submit → build payload → call `ISubmissionQueuePort.enqueue()` (Epic 4 issue 012) → show "Saved locally" confirmation → navigate back to PDM entry screen (US-FORM-02 acceptance).
- **File limits**: `BypForm.tsx` under 200 lines; extract sections into `byp/` subdirectory.
- **Validation on submit**: Block submit, highlight invalid fields, scroll to first error (US-FORM-08).
- **Conditional clear**: Reversing a trigger clears dependent field values (US-FORM-09).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: all BYP fields from US-FORM-02 Notes are rendered in logical order (TC-FORM-02-01 partial).
- [ ] Component test: Q1 "Months (specify)" shows specify text input (TC-FORM-02-02).
- [ ] Component test: Q8 = Yes shows BDS checkboxes; Q8 = No hides them (TC-FORM-02-03).
- [ ] Component test: blank mandatory field blocks submit with error (TC-FORM-02-04).
- [ ] Component test: age 12 blocked; age 15 accepted (TC-FORM-10-01/02).
- [ ] Unit test: valid form state produces a payload matching `BypSubmissionRequestDto` shape.
- [ ] On submit, `enqueue` is called with a payload containing a fresh `deviceSubmissionId`.

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md)
- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md) (for `enqueue` on submit)
