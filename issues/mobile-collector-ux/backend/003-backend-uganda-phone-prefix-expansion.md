## Objective

Expand backend Uganda mobile phone validation to accept all major operator prefixes, not only `077`, `078`, `076`, `070`, `075`.

Valid formats:

- **Local:** `07XX XXXXXX` → `0` + 3-digit prefix + 7 digits (10 digits total)
- **International:** `+256 7XX XXXXXX` → normalizes to the same local form

**Accepted prefixes:** `077`, `078`, `076`, `039`, `075`, `070`, `074`, `072`, `071`, `079`

Example that must pass after this change: `0746532164`, `+256746532164`.

## Architectural Context

- **Core domain** — `PhoneNumber` value object (`domain/valueobjects/PhoneNumber.java`); regex is the single source of truth.
- **Application / adapters** — no logic changes beyond callers that already use `PhoneNumber.of()`.
- **Frontend** — coordinated in [frontend/004](../frontend/004-frontend-uganda-phone-prefix-expansion.md).

## Current gap

```java
// PhoneNumber.java — too restrictive
Pattern.compile("^(077|078|076|070|075)\\d{7}$");
```

Same gap exists in frontend `phone-utils.ts`.

## Acceptance Criteria & TDD Checklist

- [x] **Domain test** (`PhoneNumberTest`): accept each prefix — `077`, `078`, `076`, `039`, `075`, `070`, `074`, `072`, `071`, `079` — with a valid 10-digit local number.
- [x] **Domain test:** international `+25674…` normalizes to `074…`.
- [x] **Domain test:** reject too short, too long, wrong country, or invalid prefix (e.g. `067…`).
- [x] **Adapter test:** submission / user-registration endpoints accept `074…` respondent or collector phone without 400.
- [x] Update error message to reference general format, not only `0772…` examples.

## Implementation notes

- Regex updated to `^0(77|78|76|39|75|70|74|72|71|79)\d{7}$`.
- Error message: `Invalid Uganda mobile number (use 10 digits starting with 07… or +256…): …`
- Application test: `SubmitBudgetPriorityServiceTest.shouldAccept074MobilePrefix`.

## Blocked by

None — can start immediately.

## Outcome

**Result: PASS**
