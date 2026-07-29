## Objective

Show the collector’s **registered full name** wherever the app greets or identifies the signed-in user — e.g. **“Welcome back, Jane Nakato”** — instead of the generic role label **“Field Collector”**.

Same fix applies to admin **“Administrator”** fallback when the admin’s real name is in the database.

## Root cause (confirmed)

`persistent-auth.adapter.ts` → `buildUserFromToken()` sets:

```ts
fullName: roleDisplayName(claims.role), // "Field Collector" | "Administrator"
```

JWT currently carries only `sub` + `role`, not display name. Offline cache then persists the wrong name until cleared.

## Architectural Context

- **Adapters (secondary/api)** — `persistent-auth.adapter.ts`: read `user.fullName` from extended login response ([backend/005](../backend/005-backend-auth-login-profile-response.md)); remove `roleDisplayName` fallback for online login.
- **Core store** — `useAuthStore` session already stores `user.fullName`; no schema change expected.
- **Adapters (primary/web)** — verify/update display sites:
  - `CollectorDashboard.tsx` — “Welcome back, {user?.fullName}”
  - `CollectorLayout.tsx` — header currently shows phone; consider showing truncated `fullName` (fix “Collector…” truncation in screenshot)
  - `AdminLayout.tsx` — admin header name
  - `ManageUsersMobile.tsx` — “Signed in as: …”
- **Offline login** — `cacheCredentials` already stores `fullName`; will be correct once online login provides real name. Collectors who cached the old role label need one fresh online login (document in QA steps).

## Acceptance Criteria & TDD Checklist

- [x] Adapter test: `loginOnline` maps API `user.fullName` into `AuthResponse.user`.
- [x] Adapter test: offline login returns cached real `fullName`, not role label.
- [x] `CollectorDashboard.test.tsx`: renders seeded name (e.g. “Default Collector”), not “Field Collector”.
- [x] `CollectorLayout` / router test: header shows collector name when space allows.
- [ ] Manual QA: log in as collector `0767896508` (or seeded account) → dashboard greeting uses account name from Admin → Users.
- [ ] Manual QA: admin login shows admin’s registered name in admin header.

## Manual QA note

Collectors who previously logged in online may still have `"Field Collector"` cached in IndexedDB. One fresh **online** login refreshes the cached name.

## Blocked by

- [005-backend-auth-login-profile-response.md](../backend/005-backend-auth-login-profile-response.md)

## Outcome

**Result: PASS** (automated)
