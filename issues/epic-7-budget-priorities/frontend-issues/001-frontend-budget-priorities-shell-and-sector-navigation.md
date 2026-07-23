## Objective

Build the **Budget Priorities public shell** (US-BP-01 foundation): no-login routes, sector landing/index page, and navigation entry points from the public layout — distinct from PDM dashboard and admin/collector areas.

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - `budget-priority-section.model.ts` — `BudgetPrioritySection` union: `'health' | 'agriculture' | 'education' | 'climate'` with display labels and SRS descriptions.
  - `budget-priority.routes.ts` — path constants under `/budget-priorities`.

- **Components** (`src/adapters/primary/web/budget-priorities/`):
  - `BudgetPrioritiesIndexPage.tsx` — hero + four sector cards (Health, Agriculture, Education, Climate) with short descriptions from SRS §4.7.1.
  - `BudgetPrioritySectionLayout.tsx` — wrapper for sector form + outcome routes (placeholder slots for issues `002`–`003`).

- **Routes** (`AppRouter.tsx`):
  - `/budget-priorities` → index (sector picker).
  - `/budget-priorities/:section` → sector form (no OTP gate; phone collected on form).
  - All routes **without** `ProtectedRoute`.

- **Navigation** (`PublicLayout.tsx` / `PublicNav.tsx`):
  - Add “Budget Priorities” link alongside Dashboard and Resources.
  - Optional CTA from public dashboard hero (issue `004`).

## Technical Constraints & Clean Code

- **No auth (BP-01):** Public routes must not redirect to `/login`.
- **No OTP in Epic 7:** Sector routes show the form directly; SMS verification deferred to [future-features.md FF-01](../../future-features.md).
- **Reuse:** Public layout and theme from Epic 6 ([002](../../epic-6-public-dashboard/frontend-issues/002-frontend-public-dashboard-shell-and-navigation.md), [007](../../epic-6-public-dashboard/frontend-issues/007-frontend-public-dashboard-presentation-design.md)).
- **Mobile-first:** Sector cards stack on narrow viewports; min 48px tap targets.
- Each page file < 200 lines.

## Acceptance Criteria & TDD Checklist

- [x] Component test: index page renders four sector cards with correct labels.
- [x] Route test: unauthenticated visitor loads `/budget-priorities` — no redirect to login.
- [x] Route test: `/budget-priorities/health` loads section layout shell.
- [x] Component test: public nav includes Budget Priorities link.
- [x] Component test: invalid section slug → friendly 404 or redirect to index.
- [x] Implement routes, index page, section layout shell, nav link.

## Blocked by

None — can start immediately. Complements Epic 6 public shell.
