## Objective

Align frontend Uganda phone validation, normalization, and user-facing hints with expanded mobile prefixes so collectors can enter numbers like `0746532164` without client-side rejection before sync.

Must stay consistent with backend [003-backend-uganda-phone-prefix-expansion.md](../backend/003-backend-uganda-phone-prefix-expansion.md).

## Architectural Context

- **Core** — `phone-utils.ts` (`normalizeUgandaPhoneLocal`, `isValidUgandaPhoneLocal`).
- **Core** — `form-validation.ts` (`UGANDA_PHONE_HINT`, `UGANDA_PHONE_ERROR`, `validatePhone`).
- **Adapters** — `RespondentSection.tsx` hint text; `PortalLogin.tsx` phone validation; any other copy referencing `0772…` only.
- **Tests** — `phone-utils` tests, form validation tests, affected form tests (BYP / IYP / LGO / PC).

## Current gap

```ts
// phone-utils.ts
/^(077|078|076|070|075)\d{7}$/
```

User-visible hint: *“e.g. 0772123456 or +256772123456”* — implies only `772` sub-range.

## Proposed copy (target)

- **Hint:** `Uganda mobile, e.g. 0746532164 or +256746532164`
- **Error:** `Enter a valid Uganda mobile number (10 digits starting with 07… or +2567… / +25639…).`

(Exact wording can be refined; must not imply `0772` only.)

## Acceptance Criteria & TDD Checklist

- [x] Unit test: `isValidUgandaPhoneLocal` accepts all prefixes listed in backend 003.
- [x] Unit test: `normalizeUgandaPhoneLocal('+256746532164')` → `0746532164`.
- [x] Unit test: rejects invalid numbers (unchanged negative cases).
- [x] `validatePhone` / respondent form tests: `0746532164` passes client validation on BYP (or shared respondent section test).
- [x] Hint and error strings updated wherever `UGANDA_PHONE_HINT` / `UGANDA_PHONE_ERROR` are used.
- [ ] End-to-end manual: fill respondent phone `0746532164` on phone, submit online, backend accepts payload.

## Implementation notes

- Regex aligned with backend: `^0(77|78|76|39|75|70|74|72|71|79)\d{7}$`
- `RespondentSection`, `CollectorLogin`, `ManageUsers` placeholders/hints updated
- `PortalLogin` uses shared `UGANDA_PHONE_ERROR` via `isValidUgandaPhoneLocal`

## Blocked by

- [003-backend-uganda-phone-prefix-expansion.md](../backend/003-backend-uganda-phone-prefix-expansion.md) — deploy backend before relying on sync for new prefixes; frontend can be developed in parallel but release together.

## Outcome

**Result: PASS** (automated); manual E2E on device pending.
