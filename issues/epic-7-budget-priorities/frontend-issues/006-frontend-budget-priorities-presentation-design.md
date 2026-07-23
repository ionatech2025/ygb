## Objective

Apply **modern presentation polish** to the entire Budget Priorities module (US-BP-01, US-BP-02, alignment with US-PUB-06 quality bar): consistent hero cards, sector accent colors, form styling, dashboard visual hierarchy, and responsive layout across index, forms, success states, and public dashboard BP section.

## Architectural Context

- **Theme** (`src/core/domain/`):
  - `budget-priorities.theme.ts` — presentation tokens (hero, sector cards, form panel, success state) extending patterns from `public-dashboard.theme.ts`.

- **Pages to polish**:
  - `BudgetPrioritiesIndexPage` — sector grid with icons and accent colors per section.
  - Sector form flows — card layout, consistent inputs (light/dark mode parity).
  - Success and duplicate block pages — branded confirmation iconography.
  - `PublicBudgetPrioritiesPage` — hero + inline export matching public dashboard design.

- **Navigation & footer:**
  - Ensure Budget Priorities entry points feel integrated with public layout (desktop + mobile menu).

## Technical Constraints & Clean Code

- **Responsive (TC-PUB-06-02 parity):** Verify 375px and 1440px layouts — no overlap or horizontal scroll on forms.
- **Accessibility (TC-PUB-06-03 parity):** Run axe/Lighthouse on BP index, one form, and dashboard section; fix critical contrast/tap-target issues.
- **No behaviour changes:** Presentation-only diff; existing functional tests must remain green.
- **Token reuse:** Prefer extending public theme tokens over one-off Tailwind strings.

## Acceptance Criteria & TDD Checklist

- [x] Theme unit test: exported class strings non-empty for hero, sector card, form panel.
- [x] Update component tests only where selectors depend on structural markup (minimal).
- [x] Manual/automated a11y check documented in PR — no critical violations on BP index + form + dashboard.
- [x] Visual consistency: sector cards, form panels, and dashboard section match Epic 6 public dashboard quality.
- [x] Mobile menu includes Budget Priorities with correct active states.
- [x] Implement theme file and apply across all BP components.

## Blocked by

- [001-frontend-budget-priorities-shell-and-sector-navigation.md](001-frontend-budget-priorities-shell-and-sector-navigation.md)
- [002-frontend-budget-priority-sector-forms.md](002-frontend-budget-priority-sector-forms.md)
- [003-frontend-budget-priority-submission-feedback.md](003-frontend-budget-priority-submission-feedback.md)
- [004-frontend-public-dashboard-budget-priorities-view.md](004-frontend-public-dashboard-budget-priorities-view.md)
- [005-frontend-public-dashboard-budget-priorities-export.md](005-frontend-public-dashboard-budget-priorities-export.md)
