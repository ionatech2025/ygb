## Objective

Build the **Public Dashboard shell** (US-PUB-01, foundation for US-PUB-06): a no-login layout, top navigation, and route structure for the interactive dashboard and PDM resources — distinct from the admin area and collector PWA.

## Architectural Context

- **Components** (`src/adapters/primary/web/public/`):
  - `PublicLayout.tsx` — header with branding, primary nav, responsive mobile menu.
  - `PublicDashboardHome.tsx` — placeholder regions for filters, stat cards, charts (issues `003`–`005`).

- **Routes** (`AppRouter.tsx`):
  - `/` or `/dashboard` → `PublicDashboardHome` (no `ProtectedRoute`).
  - `/resources/*` → existing PDM resources from issue `001`.
  - Collector/admin routes unchanged.

- **Nav links:** Dashboard, Resources (About PDM), optional footer with NAC attribution.

## Technical Constraints & Clean Code

- **No auth (TC-PUB-01-01):** Public routes must not wrap `ProtectedRoute` or redirect to login.
- **Reuse patterns:** Mirror admin responsive nav patterns where sensible; separate theme tokens for public “presentation” look (expanded in issue `007`).
- Each page file < 200 lines.

## Acceptance Criteria & TDD Checklist

- [x] Component test: public nav renders Dashboard and Resources links without auth context.
- [x] Route test: unauthenticated visitor loads `/dashboard` — no redirect to `/login` (TC-PUB-01-01).
- [x] Route test: `/resources` remains accessible and linked from nav.
- [x] Component test: `DATA_COLLECTOR` / `ADMIN` sessions can still access public pages (no conflict).
- [x] Implement layout, routes, navigation, and dashboard home shell with placeholder slots.

## Blocked by

None — can start immediately. Complements [001-frontend-pdm-information-resources-pages.md](001-frontend-pdm-information-resources-pages.md) (resources routes may land before or after shell; wire nav when both exist).
