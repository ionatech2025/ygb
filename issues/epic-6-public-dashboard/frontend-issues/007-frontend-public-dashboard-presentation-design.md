## Objective

Deliver **presentation-quality public dashboard design** (US-PUB-06): modern, visually compelling layout suitable for donor and government presentations — responsive on desktop and mobile, with baseline accessibility (contrast, tap targets, typography).

This issue is primarily UX/visual polish applied across issues `002`–`006`; it does not add new data features.

## Architectural Context

- **Components / Styles**:
  - `PublicLayout.tsx`, `PublicDashboardHome.tsx` — hero/header treatment, section spacing, card elevation.
  - Shared `public-dashboard.theme.ts` or Tailwind tokens — distinct from admin/collector chrome.
  - Chart colour palette aligned with NAC/PDM branding.

- **Scope:**
  - Desktop (≥1440px) and mobile (375px) layouts (TC-PUB-06-02).
  - Lighthouse/axe audit — no critical a11y violations (TC-PUB-06-03).
  - Stakeholder demo readiness (TC-PUB-06-01) — document screenshots for NAC sign-off.

## Technical Constraints & Clean Code

- Do not regress filter/chart/export behaviour from issues `003`–`006`.
- Prefer CSS/Tailwind and component composition over one-off inline styles.
- Heat map and charts must remain readable on small viewports.

## Acceptance Criteria & TDD Checklist

- [x] Visual regression / snapshot tests for key breakpoints (optional Storybook or vitest snapshot).
- [x] Automated a11y test on `PublicDashboardHome` — structural checks + landmarks (TC-PUB-06-03); optional full axe via `vitest-axe` per demo doc.
- [x] Manual responsive check at 1440px and 375px — no broken layout (TC-PUB-06-02).
- [x] Apply design polish: typography, spacing, nav, stat cards, chart containers, export toolbar.
- [x] Capture demo screenshots in `docs/` or issue comment for stakeholder review (TC-PUB-06-01).

## Blocked by

- Blocked by [frontend-issues/005-frontend-public-dashboard-charts-and-heatmap.md](005-frontend-public-dashboard-charts-and-heatmap.md)
- Blocked by [frontend-issues/006-frontend-public-dashboard-export-toolbar.md](006-frontend-public-dashboard-export-toolbar.md)
