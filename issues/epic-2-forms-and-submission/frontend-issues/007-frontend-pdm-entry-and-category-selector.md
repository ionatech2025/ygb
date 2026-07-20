## Objective

Replace the placeholder `PDMSurveyView.tsx` with a proper **PDM entry screen** that lets an authenticated Data Collector choose a respondent category and navigate to the correct questionnaire. This satisfies **US-FORM-01**.

The entry screen must:
1. Show a drop-down with exactly four options in order: Beneficiary Young Person (BYP), Individual Young Person (IYP), Local Government Official (LGO), Parish Chief (PC).
2. Load the selected form component immediately on selection.
3. Provide a "Back to category selection" action that discards in-progress form state and returns to the drop-down.
4. Retain the existing Admin lock screen (`canSubmitSurvey` guard).

## Architectural Context

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/`):
  - Refactor `PDMSurveyView.tsx` into a thin router/shell (under 150 lines).
  - Add `PdmEntryScreen.tsx` — category selector UI.
  - Add stub imports for `BypForm.tsx`, `IypForm.tsx`, `LgoForm.tsx`, `PcForm.tsx` (implemented in issues 009–012; stubs may render "Coming soon" until those issues land).

- **Frontend Core** (`src/core/store/`):
  - `useFormNavigationStore.ts` (or local `useState` in shell if store is overkill) — tracks `selectedFormType: FormType | null`.

- **Frontend Application** (`src/App.tsx`):
  - No structural change required beyond existing collector route gate; `PDMSurveyView` remains mounted in the collector layout.

## Technical Constraints & Clean Code

- **SRP**: `PdmEntryScreen` only handles category selection. Individual form components own their field logic.
- **No Duty Bearer option**: Phase 1 lists exactly four categories — do not add a fifth option.
- **Unauthenticated access**: Already handled by `App.tsx` route gate (TC-FORM-01-03). No additional auth logic needed here.
- **File limits**: `PDMSurveyView.tsx` must stay under 150 lines after refactor. Extract `PdmEntryScreen` if needed.

## Acceptance Criteria & TDD Checklist

- [x] Component test: drop-down lists exactly BYP, IYP, LGO, PC in that order (TC-FORM-01-01).
- [x] Component test: selecting IYP renders the IYP form slot (TC-FORM-01-02).
- [x] Component test: Admin user still sees the lock screen, not the category selector (TC-AUTH-04-01).
- [x] "Back" action returns to category selector and clears the selected form type.
- [x] Remove the placeholder "Household Ref ID" field — it is not part of any Epic 2 user story.

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md) (`FormType` model)
