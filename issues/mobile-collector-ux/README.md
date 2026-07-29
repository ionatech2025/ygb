# Mobile collector UX improvements

Issues filed from production / mobile field testing (July 2026). These address collector-facing polish: picker UX, password fields, Uganda phone validation, and personalized greetings.

## Issue breakdown

| # | Issue | Layer | Summary |
|---|-------|-------|---------|
| 001 | [Mobile-friendly select & picker UX](./frontend/001-frontend-mobile-select-picker-ux.md) | Frontend | Replace poor native `<select>` mobile sheets with in-app pickers |
| 002 | [Password visibility toggle](./frontend/002-frontend-password-visibility-toggle.md) | Frontend | Show/hide toggle on all password inputs |
| 003 | [Uganda phone prefix expansion](./backend/003-backend-uganda-phone-prefix-expansion.md) | Backend | Accept all major mobile prefixes in `PhoneNumber` VO |
| 004 | [Uganda phone prefix expansion](./frontend/004-frontend-uganda-phone-prefix-expansion.md) | Frontend | Align client validation, hints, and normalization |
| 005 | [Auth login profile in response](./backend/005-backend-auth-login-profile-response.md) | Backend | Return collector/admin `fullName` from login API |
| 006 | [Personalized collector greeting](./frontend/006-frontend-personalized-collector-greeting.md) | Frontend | Use real name in dashboard, header, and offline cache |
| 007 | [PWA icon YGB monogram](./frontend/007-frontend-pwa-icon-ygb-monogram.md) | Frontend | Replace “H.” placeholder with **YGB** on favicon + PWA PNGs |

## Recommended order

1. **003 → 004** (phone validation — backend first so synced submissions are not rejected)
2. **005 → 006** (display name — backend API shape before frontend auth adapter)
3. **001**, **002**, and **007** (independent UI work; can run in parallel with 003–006)

## Screenshots / context

- Native respondent-category picker renders as an unstyled system dialog on mobile (BYP / IYP / LGO / PC).
- `0746532164` rejected despite being a valid Ugandan mobile prefix.
- Dashboard shows “Welcome back, Field Collector” because JWT login path substitutes role label for `fullName`.
- Home-screen icon shows **“H.”** inside the green badge while the app label says **YGB**.
