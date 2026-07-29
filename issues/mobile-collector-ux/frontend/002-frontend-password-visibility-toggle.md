## Objective

Add a show/hide (visibility) toggle to every password input so collectors and admins can verify typed passwords on mobile keyboards.

## Problem areas (confirmed)

| File | Context |
|------|---------|
| `PortalLogin.tsx` | Main login password field |
| `CollectorLogin.tsx` | Collector login password field (if routed) |
| `ManageUsers.tsx` | Temporary password field when registering / resetting collector accounts |

## Architectural Context

- **Frontend adapters** — new shared `PasswordInput` (or `PasswordField` wrapping `FormField`) in `components/forms/`.
- **Core domain / backend** — none.

## Proposed approach

1. Create **`PasswordInput`** with:
   - `type="password"` by default; toggles to `type="text"` when visibility is on.
   - Icon button (`Eye` / `EyeOff` from `lucide-react`) inside the input row, `aria-label="Show password"` / `"Hide password"`.
   - `min-h-11` touch target; does not submit the form on toggle click (`type="button"`).
   - Accepts standard props: `id`, `value`, `onChange`, `autoComplete`, `required`, `disabled`, `className`.
2. Replace raw `<input type="password" />` usages listed above.
3. Match existing `formControlClassName` styling (rounded-xl, focus ring).

## Acceptance Criteria & TDD Checklist

- [ ] Component test: password hidden by default; toggle reveals plain text; second toggle hides again.
- [ ] Component test: toggle button has accessible label and is keyboard operable.
- [ ] `PortalLogin` test: login flow unchanged (still submits password value).
- [ ] `ManageUsers` test: register-collector password field renders toggle.
- [ ] Manual QA on mobile: toggle is tappable without zoom; password characters visible when enabled.

## Blocked by

None — can start immediately.
