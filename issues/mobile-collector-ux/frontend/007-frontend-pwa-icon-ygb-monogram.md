## Objective

Replace the in-app / home-screen PWA icon artwork so the green badge shows **“YGB”** instead of the current **“H.”** monogram (leftover placeholder branding).

The installed app label already reads **“YGB”** (`short_name` in the manifest), but the icon graphic does not match.

## Problem (confirmed)

| Asset | Location | Current state |
|-------|----------|---------------|
| `favicon.svg` | `frontend/public/favicon.svg` | Green rounded square with white **“H”** + dot |
| `pwa-192.png` | `frontend/public/pwa-192.png` | PNG export of same “H.” artwork |
| `pwa-512.png` | `frontend/public/pwa-512.png` | PNG export; also used as **maskable** icon |

Referenced by:

- `frontend/index.html` — tab favicon
- `frontend/workbox-config.ts` — PWA manifest icons
- `frontend/vite.config.ts` — `includeAssets` for service worker precache

## Design requirements

- **Letters:** `YGB` (all caps), legible at 48×48 and smaller (home screen, browser tab).
- **Background:** keep existing brand green `#359661` (`PWA_THEME_COLOR`).
- **Foreground:** white text (`#ffffff`).
- **Shape:** retain rounded-square app-icon feel (match current `rx="8"` on 32×32 SVG or equivalent on PNG canvas).
- **Maskable icon (`pwa-512.png`, purpose `maskable`):** keep “YGB” inside the safe zone (central ~80% — Android adaptive icons crop edges).
- **Accessibility:** SVG keeps `role="img"` and `aria-label="YGB"`.

## Architectural Context

- **Frontend static assets only** — `frontend/public/`.
- **No backend**, no runtime code changes unless a component embeds the old SVG inline (audit during implementation).

## Acceptance Criteria & TDD Checklist

- [ ] Update `favicon.svg` — visible text is **YGB**, not H/dot.
- [ ] Regenerate `pwa-192.png` and `pwa-512.png` from the approved artwork (same visual as SVG at each size).
- [ ] Manual QA — browser tab favicon shows **YGB** on green background.
- [ ] Manual QA — **Add to Home Screen** (Android / iOS): icon shows **YGB** inside the green badge; label remains **YGB**.
- [ ] Manual QA — maskable icon: **YGB** not clipped on Android circular/squircle launcher shapes.
- [ ] Production build smoke: `npm run build && npm run preview` — manifest icons resolve and cache via service worker.

## Out of scope

- Full NAC / client logo redesign beyond the three-letter monogram.
- Changing manifest `name` / `short_name` strings (already correct).

## Blocked by

None — can start immediately.
