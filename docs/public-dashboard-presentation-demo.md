# Public dashboard — presentation demo (TC-PUB-06-01)

This document supports stakeholder design sign-off for **US-PUB-06** (presentation-quality public dashboard).

## Design highlights

- **Hero band** — NAC blue → brand green gradient with orange eyebrow label; sets presentation tone for donor/government demos.
- **Section rhythm** — Filters → Export → Summary → Charts, each with icon headings and consistent spacing (`space-y-10`).
- **Stat cards** — Top accent stripes (brand / NAC blue / NAC orange) with hover elevation.
- **Chart panels** — Card containers with brand accent bar; ECharts palette aligned via `public-dashboard.theme.ts`.
- **Export toolbar** — Descriptive copy plus large tap-target download buttons.
- **Public chrome** — Gradient top rule, sticky blurred header, soft page background (`public-layout-bg`).

Theme tokens live in `frontend/src/core/domain/public-dashboard.theme.ts`.

## Capturing screenshots for NAC review

1. Start backend and frontend locally:
   ```powershell
   cd backend
   mvn spring-boot:run

   cd frontend
   npm run dev
   ```
2. Open `http://localhost:5173/dashboard` (no login required).
3. Capture at **1440×900** (desktop) and **375×812** (mobile):
   - Full page (hero through charts)
   - Filters panel expanded
   - Summary stat cards row
   - Charts grid + geographic heat map
4. Save files under `docs/screenshots/public-dashboard/` (create folder if needed):
   - `desktop-1440-full.png`
   - `mobile-375-full.png`
   - `desktop-filters.png`
   - `desktop-charts.png`
5. Attach screenshots to the stakeholder review ticket or Epic 6 issue comment.

## Responsive checklist (TC-PUB-06-02)

| Viewport | Checks |
|----------|--------|
| 1440px | Hero title scales (`xl:text-4xl`); stat cards 4-column (`xl:grid-cols-4`); charts 2-column grid |
| 375px | Mobile nav menu; single-column cards/charts; export buttons wrap; heat map single column |

## Accessibility checklist (TC-PUB-06-03)

Automated structural checks run in `PublicDashboardPresentation.test.tsx`. For full axe/Lighthouse audit:

1. Open Chrome DevTools → Lighthouse → Accessibility on `/dashboard`.
2. Confirm **zero critical** violations (contrast, tap targets, landmarks).
3. Optional: after disk space is available, install `vitest-axe` and run:
   ```powershell
   cd frontend
   npm install --save-dev vitest-axe axe-core
   npm test -- --run src/adapters/primary/web/public/PublicDashboardPresentation.test.tsx
   ```

## Sign-off

| Reviewer | Date | Approved (Y/N) | Notes |
|----------|------|----------------|-------|
| NAC / Tricia | | | |
| iONA team | | | |
