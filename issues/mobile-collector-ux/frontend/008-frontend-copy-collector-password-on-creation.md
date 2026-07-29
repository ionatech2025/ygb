## Objective

After an admin creates a data collector account, show the **initial password** in a copy-friendly panel so it can be shared with the collector outside the system (SMS, WhatsApp, in person). Mirrors the existing reset-password share flow.

## Problem areas (confirmed)

| File | Context |
|------|---------|
| `ManageUsers.tsx` | Register-collector form clears the password on success with only a generic toast — admin cannot copy the value they just set |

Reset password already exposes `temporaryPassword` with **Copy to clipboard** (`reset-password-result`). Creation has no equivalent.

## Architectural Context

- **Frontend adapters** — `ManageUsers.tsx` (and a small shared banner if extracted).
- **Backend** — none; password is known client-side at submit time (admin-chosen initial password).

## Proposed approach

1. On successful `createDataCollector`, capture `{ fullName, phoneNumber, password }` **before** clearing the form.
2. Render a dismissible success panel (reuse styling from reset-password result):
   - Monospace password display
   - **Copy to clipboard** button (`navigator.clipboard.writeText`)
   - Short guidance: share once; dismissed password is not recoverable from this screen
3. Optional: **Copy login details** secondary action copying `phone + password` for paste into SMS — only if it fits without clutter (password-only copy is minimum).
4. Unify reset + creation panels behind one `ShareablePasswordPanel` to avoid duplicated markup.

## Acceptance Criteria & TDD Checklist

- [x] After registering a collector, panel shows collector name and the initial password entered in the form.
- [x] **Copy to clipboard** writes the password; button feedback shows "Copied".
- [x] Dismiss clears the panel; password field in the form stays empty.
- [x] Reset-password flow unchanged (same panel pattern, different copy).
- [x] `ManageUsers.test.tsx`: create-collector success shows panel and copy action.

## Blocked by

**002** (password visibility toggle) — recommended so admin can verify password before submit; not strictly required.

## Related

- [002 — Password visibility toggle](./002-frontend-password-visibility-toggle.md)
