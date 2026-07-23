## Objective

Build the **LGO Budget Allocation collector shell** (US-LGOB-01 foundation): authenticated route, collector navigation entry, and access guard so the form is **only reachable by Data Collectors** (TC-LGOB-01-01). Unauthenticated visitors and public users must not access the form.

## Architectural Context

- **Frontend Domain** (`src/core/domain/`):
  - `lgo-budget-allocation.routes.ts` — path constants under `/collector/lgo-budget-allocation` (or equivalent).
  - `lgo-budget-allocation-form.model.ts` — placeholder types for issue `002`.

- **Components** (`src/adapters/primary/web/lgo-budget-allocation/`):
  - `LgoBudgetAllocationPage.tsx` — page shell with hero intro explaining the interview purpose (LGO-02 summary).
  - Form slot placeholder for issues `002`–`003`.

- **Routes** (`AppRouter.tsx`):
  - Protected route under `CollectorLayout` with `allowedRoles={['DATA_COLLECTOR']}`.
  - Unauthenticated access → redirect to `/login`.
  - Public layout routes must not expose this path.

- **Navigation** (`CollectorLayout` / `CollectorDashboard`):
  - Add entry card or nav link: “LGO Budget Allocation” — distinct from PDM LGO Questionnaire.
  - Brief description: prior-FY allocations, rationale, recommendations.

## Technical Constraints & Clean Code

- **TC-LGOB-01-01:** Route tests prove `/collector/lgo-budget-allocation` redirects unauthenticated users.
- **Not public:** Must not appear in `PublicNav`.
- **Distinct from Epic 2 LGO form:** Clear labelling — “Budget Allocation Interview” vs “LGO Questionnaire”.
- **Mobile-first:** Collector PWA primary target 360–414 px; min 48px tap targets.
- Each page file < 200 lines.

## Acceptance Criteria & TDD Checklist

- [ ] Component test: page renders title and intro copy for collectors.
- [ ] Route test: unauthenticated visitor → redirect to login (TC-LGOB-01-01).
- [ ] Route test: authenticated `DATA_COLLECTOR` loads page shell.
- [ ] Route test: `ADMIN` without collector role cannot access (if role separation applies).
- [ ] Component test: collector dashboard includes LGO Budget Allocation entry point.
- [ ] Implement routes, page shell, and navigation entry.

## Blocked by

None — can start immediately. Requires Epic 1 auth and Epic 4 collector layout.
