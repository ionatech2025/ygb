## Objective

Implement the full **Local Government Official (LGO)** survey form UI with fiscal-year fund fields, beneficiary statistics, governance questions, and conditional explain fields. On valid submit, build an `LgoSubmissionPayload` matching `LgoSubmissionRequestDto`. This satisfies **US-FORM-04**.

## Architectural Context

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/lgo/`):
  - `LgoForm.tsx` — main orchestrator.
  - `LgoFiscalYearSection.tsx` — dynamic list of `FiscalYearRecord` entries (expected/actual funds, beneficiary counts, parish coverage per FY label).
  - `LgoGovernanceSection.tsx` — Q4–Q7 Yes/No governance questions.
  - `LgoExplainSection.tsx` — Q8/Q9 with conditional explain textareas.
  - `LgoFeedbackSection.tsx` — improvement suggestion.

- **Payload mapping**: Output must match `backend/.../dto/LgoSubmissionRequestDto.java`, including `fiscalYearRecords` as an array of objects with labels `"2022/23"`, `"2023/24"`, etc.

## Field & validation rules (from US-FORM-04)

| Field | Rule |
|-------|------|
| Expected/Actual fund amounts | Numeric only; reject non-numeric input (TC-FORM-04-03) |
| Beneficiary counts, parish coverage | Numeric integers ≥ 0 |
| `fundsSpentExplanation` | Required when Q8 (funds spent as required) = No |
| `economicTransformationExplanation` | Required when Q9 (economic transformation) = No |
| `improvementSuggestion` | Narrative ≥ 10 chars when provided |

## Technical Constraints & Clean Code

- **FY records**: Render separate Expected/Actual inputs for FY 2022/23 and FY 2023/24 at minimum (TC-FORM-04-01). Use a repeatable row pattern if the list grows.
- **Submit flow**: validate → build payload → `enqueue` → confirmation → return to entry screen.
- **File limits**: Each section under 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: separate Expected/Actual inputs exist for FY2022/23 and FY2023/24 (TC-FORM-04-01).
- [ ] Component test: Q8 = No shows explain field and blocks submit if empty (TC-FORM-04-02).
- [ ] Component test: non-numeric fund input blocked with inline error (TC-FORM-04-03).
- [ ] Component test: Q8/Q9 = Yes path submits without explain fields (TC-FORM-04-04).
- [ ] Unit test: payload `fiscalYearRecords` array structure matches backend `FiscalYearRecord` JSON shape.
- [ ] Narrative fields enforce ≥ 10 characters (TC-FORM-12-03 on LGO explain field).

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md)
- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
