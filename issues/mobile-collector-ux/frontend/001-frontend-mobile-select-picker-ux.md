## Objective

Improve mobile UX for all dropdown / single-select controls used in the collector flow. Native `<select>` elements open OS-specific sheets that look unstyled, misaligned, and inconsistent with the app theme (see respondent category picker on `/collector/dashboard`).

Replace or restyle selects so pickers feel intentional on phone-sized viewports.

## Problem areas (confirmed)

| Location | Control | Current implementation |
|----------|---------|------------------------|
| `PdmEntryScreen.tsx` | Respondent category (BYP / IYP / LGO / PC) | ~~Native `<select>`~~ → `FormSelect` (expanded radio list) |
| `RespondentSection.tsx` | Gender, age group | ~~Native `<select>`~~ → `FormSelect` |
| `CascadingLocationSelector.tsx` | District, sub-county, parish, village | ~~Native `<select>` × 4~~ → `FormSelect` (collapsible combobox) |
| Form-specific sections | Various enums (e.g. BYP fund section, rating selects) | ~~Native `<select>`~~ → `FormSelect` via `BypFundSection`, `PcPdcSection`, `RatingSelect` |

## Architectural Context

- **Frontend adapters (primary/web)** — new shared picker component(s) under `components/forms/`.
- **Core domain** — no changes; option labels/values stay in existing domain models (`FORM_TYPE_OPTIONS`, `GENDER_OPTIONS`, `AGE_GROUP_LABELS`, etc.).
- **Backend** — none.

## Proposed approach

1. Introduce a reusable **`FormSelect`** (or **`OptionPicker`**) component:
   - **Mobile (< sm):** full-width tappable list / radio-card stack inside the form (no OS sheet). Long labels (e.g. “Beneficiary Young Person (BYP)”) wrap cleanly with consistent padding and dividers.
   - **Desktop (≥ sm):** may keep styled native select *or* use the same in-app list for consistency.
   - Meets touch targets (`min-h-11`), uses existing `formControlClassName` tokens, supports `required`, `disabled`, `aria-*`, and error state from `FormField`.
2. **Priority:** migrate `PdmEntryScreen` first (category selection), then `RespondentSection` + `CascadingLocationSelector`.
3. Optional enhancement: selected value shown as a compact summary row with chevron before opening the list (bottom-sheet pattern acceptable if it matches app styling).

## Acceptance Criteria & TDD Checklist

- [x] Component test: `FormSelect` renders options, fires `onChange`, exposes accessible name/label.
- [x] Component test: long option labels wrap without horizontal overflow on 320px viewport.
- [x] `PdmEntryScreen.test.tsx`: selecting BYP / IYP / LGO / PC still loads the correct form.
- [x] `RespondentSection` / location tests: gender, age group, and cascade selects still work with Testing Library `selectOptions` equivalent (click/tap option).
- [ ] Visual QA on mobile (Chrome device toolbar or real phone): respondent category picker matches app dark theme; no system-default grey dialog.
- [x] No regression on desktop collector forms.

## Out of scope

- Multi-select checkbox groups (already custom UI).
- Admin dashboard filters (can follow same component later in a separate issue if desired).

## Blocked by

None — can start immediately.
