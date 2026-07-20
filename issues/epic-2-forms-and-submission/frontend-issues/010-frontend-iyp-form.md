## Objective

Implement the full **Individual Young Person (IYP)** survey form UI with all sections, branching conditional logic, multi-select fields, and client-side validation. On valid submit, build an `IypSubmissionPayload` matching `IypSubmissionRequestDto`. This satisfies **US-FORM-03**.

## Architectural Context

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/iyp/`):
  - `IypForm.tsx` — main orchestrator.
  - `IypAwarenessSection.tsx` — Q1–Q3 (PDM awareness, information channels, eligibility awareness).
  - `IypApplicationSection.tsx` — Q6–Q9 (applied, accessed, rejection narrative, reasons for not applying).
  - `IypBarriersSection.tsx` — Q10 difficulties faced (multi-select + limitation explanation).
  - `IypFeedbackSection.tsx` — improvement suggestion.

- **Payload mapping**: Output must match `backend/.../dto/IypSubmissionRequestDto.java`.

## Conditional logic (from US-FORM-03)

| Trigger | Effect |
|---------|--------|
| Q1 (aware of PDM) = Unaware | Hide Q3 (eligibility awareness); not required |
| Q6 (applied for fund) = No | Hide Q7/Q8; show Q9 (reasons for not applying), required |
| Q6 = Yes, Q7 (accessed fund) = No | Show Q8 (rejection narrative), required |
| Q6 = Yes, Q7 = Yes | Hide Q8 and Q9 |
| Q10 includes "Limitation in the amount…" | Show `limitationExplanation`, required |

Multi-select fields (Q2 information channels, Q9 reasons, Q10 difficulties) use `MultiCheckboxGroup` with array output (US-FORM-11).

## Technical Constraints & Clean Code

- **Submit flow**: Same as BYP — validate → build payload → `enqueue` → confirmation → return to entry screen.
- **Conditional clear**: Changing Q6 from No→Yes must discard Q9 value (TC-FORM-09-03).
- **File limits**: Each section file under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: Q1 = Unaware hides Q3 (TC-FORM-03-01).
- [ ] Component test: Q6 = No shows Q9, hides Q7/Q8 (TC-FORM-03-02).
- [ ] Component test: Q6 = Yes, Q7 = No shows Q8 (TC-FORM-03-03).
- [ ] Component test: limitation checkbox shows explanation field (TC-FORM-03-04).
- [ ] Component test: aware + applied + accessed path submits without Q8/Q9 (TC-FORM-03-05).
- [ ] Component test: multiple checkboxes selectable on Q2 (TC-FORM-11-01).
- [ ] Unit test: payload arrays (`informationChannels`, `reasonsForNotApplying`, `difficultiesFaced`) contain all selected values (TC-FORM-11-02).

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md)
- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
