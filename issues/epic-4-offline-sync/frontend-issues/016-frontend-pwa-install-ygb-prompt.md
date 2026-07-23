## Objective

Implement the **“Install YGB” PWA install prompt** so Data Collectors (primary PWA users) can add the app to their home screen for offline-first field work. The Service Worker and manifest are already configured ([011-frontend-pwa-service-worker-setup.md](011-frontend-pwa-service-worker-setup.md)), but there is **no install UI** — `registerSW` callbacks in `main.tsx` are intentionally empty placeholders.

This issue delivers a user-visible install experience that surfaces when the browser supports installation and the app is not already running in standalone mode.

## Architectural Context

- **Frontend Domain** (`src/core/domain/` or `src/core/hooks/`):
  - `usePwaInstallPrompt.ts` — hook encapsulating:
    - `beforeinstallprompt` event capture and deferred prompt.
    - `appinstalled` listener to hide UI permanently.
    - Standalone detection (`display-mode: standalone` or `navigator.standalone` on iOS).
    - Dismiss persistence (e.g. `localStorage` key `ygb-pwa-install-dismissed` with optional expiry).
  - iOS fallback: no `beforeinstallprompt` — show “Add to Home Screen” instructions (Share → Add to Home Screen).

- **Components** (`src/adapters/primary/web/components/`):
  - `PwaInstallBanner.tsx` — non-blocking banner or bottom sheet:
    - Title: “Install YGB” / “Add Youth Go Budget to your home screen”.
    - Primary action: triggers deferred install prompt (Chromium) or opens iOS help modal.
    - Secondary action: “Not now” dismisses with persistence.
  - Optional `PwaInstallIosHelp.tsx` — short illustrated steps for Safari.

- **Layout integration**:
  - Mount banner in `CollectorLayout` (primary audience — offline field collectors).
  - Optionally show on `PortalLogin` for first-time collector login (document decision in PR).
  - Do **not** block form interaction; banner is dismissible.

- **Manifest polish** (if needed):
  - Verify `workbox-config.ts` / `pwaManifest` includes adequate icons for install dialog (192/512 PNG if `favicon.svg` insufficient on some Android builds — add assets under `public/` if required).

## Technical Constraints & Clean Code

- **No install prompt when already installed:** Hide when `display-mode: standalone`.
- **Respect user dismiss:** Do not re-show every page load if dismissed within configured window (e.g. 7 days) unless product specifies “always offer”.
- **Accessibility:** Banner buttons named (“Install YGB”, “Not now”); min `min-h-11` tap targets; `role="region"` with `aria-label`.
- **SSR-safe / test-safe:** Hook guards `window` / `beforeinstallprompt` for jsdom tests.
- **No business logic in `main.tsx`:** Install UI lives in React components/hooks only.

## Acceptance Criteria & TDD Checklist

- [x] Unit test: hook returns `canInstall: false` when running in standalone mode (mock `matchMedia`).
- [x] Unit test: hook stores dismiss flag and suppresses banner when dismissed.
- [x] Component test: banner renders Install + Not now when `canInstall` true.
- [x] Component test: Install click calls deferred `prompt()` mock; success hides banner.
- [x] Component test: iOS user agent shows help content instead of install button (or secondary “How to install” link).
- [x] Component test: banner not rendered for authenticated collector when already standalone.
- [x] Manual test checklist (document in PR):
  - Chrome Android / desktop: `beforeinstallprompt` → Install works.
  - Safari iOS: instructions shown; no console errors.
  - Already installed PWA: no banner.
- [x] Integrate banner into `CollectorLayout`; verify no layout shift blocking sync status bar.

## Implementation notes

- Delivered in commit `106f97d`: `usePwaInstallPrompt`, `pwa-install-prompt.model`, `PwaInstallBanner`, `PwaInstallIosHelp`, mounted in `CollectorLayout` below `SyncStatusBar`.
- **PortalLogin:** not mounted — collectors reach the banner after login via `CollectorLayout` (primary audience).
- **Manifest icons:** existing `favicon.svg` retained; PNG 192/512 not added (no install-dialog issues observed in dev; add under `public/` if Android QA requires).
- **Dismiss window:** 7 days via `ygb-pwa-install-dismissed` in `localStorage`.

## Blocked by

- [011-frontend-pwa-service-worker-setup.md](011-frontend-pwa-service-worker-setup.md) — must be complete (already done).

## Related

- Epic 8 collector forms depend on PWA install for optimal offline UX — see [epic-8 README](../../epic-8-lgo-budget-allocation/README.md).
- SRS NFR 5.1: post-install load performance targets assume home-screen installation.
