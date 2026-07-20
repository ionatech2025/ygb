## Objective

Establish the shared frontend foundation for all four PDM survey forms: domain types aligned with the backend REST DTOs, reusable field components, client-side validation rules, and conditional-field utilities. This issue delivers the cross-cutting behaviours required by US-FORM-08, US-FORM-09, US-FORM-10, US-FORM-11, and US-FORM-12 before any form-specific UI is built.

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - `form-type.model.ts` — `FormType` union: `'BYP' | 'IYP' | 'LGO' | 'PC'`.
  - `submission-payload.model.ts` — TypeScript interfaces mirroring backend `SubmissionRequestDto` hierarchy (shared base fields + per-form extensions). Field names and enum values must match `backend/.../dto/*SubmissionRequestDto.java` exactly.
  - `form-validation.model.ts` — shared constants: `MIN_AGE = 15`, `MIN_NARRATIVE_LENGTH = 10`, rating scale values, age-group enum values.

- **Frontend Core** (`src/core/`):
  - `form-validation.ts` — pure functions: `validateAge`, `validateNarrativeText`, `validateRequired`, `validatePhone`.
  - `useConditionalFields.ts` — hook that tracks visible field keys and clears values when a trigger condition becomes false (US-FORM-09).

- **Frontend Primary Adapters — Components** (`src/adapters/primary/web/components/forms/`):
  - `FormField.tsx` — label + control wrapper; renders red `*` for required fields (US-FORM-08).
  - `FormSection.tsx` — titled section container for grouping fields.
  - `RatingSelect.tsx` — 5-point rating dropdown (VERY_GOOD … VERY_POOR).
  - `MultiCheckboxGroup.tsx` — checkbox list with optional "Others (specify)" sub-field (US-FORM-11).
  - `NarrativeTextarea.tsx` — textarea with live min-length validation (US-FORM-12).
  - `YesNoRadioGroup.tsx` — standard Yes/No radio pair used across forms.

## Technical Constraints & Clean Code

- **No API calls**: This issue is UI infrastructure and domain types only. No fetch, no IndexedDB.
- **Validation parity**: Client rules must mirror backend domain invariants (age ≥ 15, narrative ≥ 10 chars) so invalid payloads never reach the submission queue.
- **File limits**: Keep each component file under 200 lines. Extract sub-components if a form-specific wrapper is needed later.
- **Tailwind only**: Match existing slate/green design system from `App.tsx` and `PDMSurveyView.tsx`.
- **Testability**: Pure validation functions must have unit tests (Vitest). Components should have React Testing Library tests for asterisk rendering, checkbox multi-select, and conditional clear behaviour.

## Acceptance Criteria & TDD Checklist

- [ ] `FormType` and submission payload TypeScript types exist and match backend DTO field names.
- [ ] Unit tests verify `validateAge(14)` fails and `validateAge(15)` passes (TC-FORM-10-01/02).
- [ ] Unit tests verify `validateNarrativeText('ok')` fails and a 12-char string passes (TC-FORM-12-01/02).
- [ ] `FormField` renders a red asterisk when `required={true}` (TC-FORM-08-01).
- [ ] `MultiCheckboxGroup` allows multiple simultaneous selections (TC-FORM-11-01).
- [ ] `MultiCheckboxGroup` shows and requires a specify field when "Others (specify)" is checked (TC-FORM-11-03).
- [ ] `useConditionalFields` clears a dependent field's value when its trigger condition becomes false (TC-FORM-09-03).
- [ ] All new files remain under 200 lines.

## Blocked by

None — can start immediately.
