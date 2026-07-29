## Objective

Restore **dropdown** behaviour for all single-select controls: collapsed trigger by default, option list opens in a **bounded panel with internal scroll** for long lists. Avoid pushing the entire page viewport.

Issue [001 (mobile-collector-ux)](../../mobile-collector-ux/frontend/001-frontend-mobile-select-picker-ux.md) replaced native OS sheets with `FormSelect`, but two regressions remain in production:

1. **Expanded mode** — short lists (respondent category, gender, age group, ratings) rendered as always-visible radio stacks (image 1–2). **Product decision:** all lists use collapsed dropdown + scroll panel, including short enums.
2. **Collapsible mode without scroll cap** — location cascade lists (sub-county, parish, village) expand inline and can exceed screen height (images 3–4).

Additionally, **native `<select>`** was still used on admin and public dashboard filters (image 5).

## Problem areas (confirmed)

| Location | Control | Current behaviour |
|----------|---------|-------------------|
| `PdmEntryScreen.tsx` | Respondent category | Expanded radio list (4 options always visible) |
| `RespondentSection.tsx` | Gender, age group | Expanded radio lists |
| `RatingSelect.tsx`, `BypFundSection.tsx`, `PcPdcSection.tsx` | Enum / rating fields | Expanded radio lists |
| `CascadingLocationSelector.tsx` | District → village | Collapsible, but list grows unbounded below field |
| `DashboardFilterPanel.tsx` | Form type, gender, age, FY, collector | Native `<select>` |
| `PublicDashboardScalarFilters.tsx` | Form type, gender, age, FY | Native `<select>` |
| `BudgetPriorityScalarFilters.tsx` | Gender, age, FY, section | Native `<select>` |
| `LgoBudgetAllocationScalarFilters.tsx` | Gender, age, FY | Native `<select>` |
| `BudgetPriorityDemographicsSection.tsx` | Gender, age, district | Native `<select>` |
| `AdminDashboardLocationSelector.tsx` | Location levels | Native `<select>` |
| `CollectorProfilePage.tsx` | Filter selects | Native `<select>` |
| `AdminFiscalYearSettingsPanel.tsx` | Fiscal year | Native `<select>` |

## Architectural Context

- **Frontend adapters (primary/web)** — evolve `FormSelect` in `components/forms/`; migrate all remaining `<select>` usages.
- **Core domain** — no changes; option values/labels stay in existing models.
- **Backend** — none.

## Proposed approach

### 1. Refine `FormSelect` (all instances default to dropdown)

- **Always collapsed** until the user taps the trigger (single behaviour for all lists, including short enums).
- **Option panel:**
  - `max-height` (~40vh or `min(280px, 40dvh)`) with `overflow-y: auto` and `-webkit-overflow-scrolling: touch`.
  - Position below trigger; close on selection, outside click, and `Escape`.
- **Accessibility:** retain `role="combobox"`, `aria-expanded`, `aria-controls`, listbox `role="listbox"` / radio pattern.
- **Visual:** match `formControlClassName`, dark theme, chevron, selected value in trigger — no OS chrome.

### 2. Migrate remaining native selects

Priority order:

1. Collector forms (already on `FormSelect` — config change only)
2. Public dashboard scalar filters (`PublicDashboardScalarFilters.tsx`)
3. Admin dashboard filters (`DashboardFilterPanel.tsx`, `AdminDashboardLocationSelector.tsx`)
4. Budget priorities / LGO budget allocation public filters
5. Admin fiscal year + collector profile filters

### 3. Tests

- Update `choose-form-option` helpers for scrollable panel (open combobox before querying options inside scroll container).
- Component tests: long list (20+ items) stays within max-height; `scrollHeight > clientHeight` on panel.
- Regression: existing form fill tests (BYP, IYP, LGO, PC, location cascade).

## Acceptance Criteria & TDD Checklist

- [x] `FormSelect`: default UI is collapsed trigger; options not visible until opened.
- [x] `FormSelect`: option panel has internal scroll when list exceeds max-height (unit test with 30 mock options).
- [x] `PdmEntryScreen`, `RespondentSection`, location cascade: selecting an option closes panel without scrolling the whole page to reveal more fields.
- [x] Public dashboard filters (image 5): form type / gender / age group / financial year use themed dropdown, not native select.
- [x] Admin dashboard filters migrated to same component.
- [x] No remaining `<select>` in collector flow or public dashboard filter panels (grep audit).
- [ ] Manual QA on mobile (320px width): parish list with 10+ entries scrolls inside panel; viewport scroll minimal.
- [ ] Manual QA on desktop: dropdown panels align with field width; dark theme consistent.

## Out of scope

- Multi-select checkbox groups (unchanged).
- Replacing `<input type="date">` or other native controls.

## Blocked by

None — can start immediately.

## Related

- [mobile-collector-ux/frontend/001](../../mobile-collector-ux/frontend/001-frontend-mobile-select-picker-ux.md) — original picker introduction
