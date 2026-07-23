## Objective

Apply **presentation polish** to the LGO Budget Allocation module (US-LGOB-01, US-LGOB-02, alignment with Epic 6/7 public dashboard quality): consistent collector form styling, public dashboard hero, comparative chart layout, and responsive behaviour across collector form and public dashboard pages.

## Architectural Context

- **Theme** (`src/core/domain/`):
  - `lgo-budget-allocation.theme.ts` — presentation tokens extending `public-dashboard.theme.ts` and collector form patterns.

- **Pages to polish**:
  - `LgoBudgetAllocationPage` / form — card layout, sector allocation grid, rationale/recommendation text areas.
  - `PublicLgoBudgetAllocationPage` — hero + inline export matching public dashboard design.
  - Collector dashboard entry card for LGO Budget Allocation.

- **Navigation:**
  - Public nav entry for LGO dashboard section with correct active states on `/dashboard/lgo-budget-allocation`.

## Technical Constraints & Clean Code

- **Responsive (TC-PUB-06-02 parity):** Verify 375px and 1440px — no horizontal scroll on form or dashboard.
- **Accessibility (TC-PUB-06-03 parity):** Named controls, contrast, min tap targets on collector + public pages.
- **No behaviour changes:** Presentation-only diff; functional tests remain green.
- **Token reuse:** Extend public/collector theme tokens — avoid one-off Tailwind strings.

## Acceptance Criteria & TDD Checklist

- [ ] Theme unit test: exported class strings non-empty for form panel and dashboard hero.
- [ ] Update component tests only where selectors depend on structural markup (minimal).
- [ ] Presentation test file mirroring `BudgetPrioritiesPresentation.test.tsx` / `PublicDashboardPresentation.test.tsx`.
- [ ] Visual consistency with Epic 6 public dashboard and Epic 7 Budget Priorities section.
- [ ] Mobile menu / public nav includes LGO dashboard link with correct active states.
- [ ] Implement theme file and apply across LGO Budget Allocation components.

## Blocked by

- [001-frontend-lgo-budget-allocation-collector-shell-and-routing.md](001-frontend-lgo-budget-allocation-collector-shell-and-routing.md)
- [002-frontend-lgo-budget-allocation-form.md](002-frontend-lgo-budget-allocation-form.md)
- [004-frontend-public-dashboard-lgo-budget-allocation-view.md](004-frontend-public-dashboard-lgo-budget-allocation-view.md)
- [005-frontend-public-dashboard-lgo-budget-allocation-export.md](005-frontend-public-dashboard-lgo-budget-allocation-export.md)
