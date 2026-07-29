## Objective

Update **shared collector form UI** for all four PDM tools per cross-cutting client requests (28 July 2026):

1. **Respondent name** — optional (remove required validation and asterisk).
2. **Remove exact age field** from BYP (and any shared respondent section usage).
3. **Age brackets** — replace current options with:
   - 18–24
   - 25–29
   - 30–35
   - Above 35
4. Apply global UX patterns (used by tool-specific issues):
   - Multi-select questions show **"(select all that apply)"**
   - **Other (specify)** options always reveal a text input
   - Spell out **Parish Development Committee** where PDC appears

Reference: [PDM_Tools_Change_Requests_07282026.md §1](../../docs/suggested_changes/07282026/PDM_Tools_Change_Requests_07282026.md).

## Architectural Context

- **Frontend Primary Adapters**
  - `RespondentSection` / `respondent-fields.model.ts` — optional name, updated age group enum.
  - `byp-validation.ts` — drop `exactAge` rules.
  - Shared components: ensure `MultiCheckboxGroup` supports hint prop; `OtherSpecifyField` pattern reusable.

- **Core Domain (frontend)**
  - Update age group constants to match backend `AgeGroup` after backend 001 ships.

## Acceptance Criteria & TDD Checklist

- [x] Component test: submit BYP with blank respondent name succeeds.
- [x] Component test: exact age input not rendered on BYP.
- [x] Component test: new age bracket options rendered; Below 18 shows out-of-scope message or blocks submit per backend rule.
- [x] Unit tests: validation modules updated; payload omits `exactAge`.
- [x] All four form entry points use shared respondent section consistently.

## Blocked by

- [backend/001-backend-cross-cutting-respondent-age-bracket-changes.md](../backend/001-backend-cross-cutting-respondent-age-bracket-changes.md)

## Blocks

- [003-frontend-byp-question-wording-and-fields.md](003-frontend-byp-question-wording-and-fields.md)
- [004-frontend-iyp-question-wording-and-fields.md](004-frontend-iyp-question-wording-and-fields.md)
- [006-frontend-pc-question-numbering-wording-and-fields.md](006-frontend-pc-question-numbering-wording-and-fields.md)
