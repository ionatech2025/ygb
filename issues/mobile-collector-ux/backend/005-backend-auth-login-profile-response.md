## Objective

Return the authenticated user’s real **`fullName`** (and stable profile fields) from the login API so the frontend does not infer display name from JWT role claims.

Today login returns only `{ "token": "…" }`. The frontend decodes the JWT and substitutes `"Field Collector"` / `"Administrator"` via `roleDisplayName()` in `persistent-auth.adapter.ts`, which is why the dashboard shows **“Welcome back, Field Collector”** instead of the registered name.

## Architectural Context

- **Application** — extend `AuthenticationResult` to include profile fields returned after successful authentication (`fullName`, `phoneNumber`, `role`, `id`).
- **Domain** — use existing `User` entity fields; no new business rules.
- **Adapters (in/rest)** — extend `AuthResponse` DTO and `AuthController.login` mapping; keep controller thin.
- **Adapters (out/security/jwt)** — JWT may remain as-is (userId + role) **or** optionally add `fullName` claim; prefer explicit login response body as source of truth for display name.
- **Frontend** — consumed in [frontend/006](../frontend/006-frontend-personalized-collector-greeting.md).

## Proposed API shape

```json
POST /api/v1/auth/login
→ 200 OK
{
  "token": "eyJ…",
  "user": {
    "id": "22222222-2222-2222-2222-222222222222",
    "fullName": "Default Collector",
    "phoneNumber": "0771111111",
    "role": "DATA_COLLECTOR"
  }
}
```

Backward compatibility: existing clients that only read `token` continue to work until frontend 006 ships.

## Acceptance Criteria & TDD Checklist

- [ ] **Application test** (`AuthenticateUserServiceTest`): result includes `fullName` from persisted user.
- [ ] **Adapter test** (`AuthControllerTest`): JSON body contains `user.fullName` matching seeded collector/admin.
- [ ] **Domain / VO tests** — none required beyond existing user model.
- [ ] OpenAPI / DTO validation: `AuthResponse` documents new fields.
- [ ] No business logic in controller or DTO classes.

## Blocked by

None — can start immediately.
