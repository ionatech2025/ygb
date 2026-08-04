## Objective

Build the public **download profile form** UI (country, gender, age, field of operation, email, optional name, consent) and client-side **session** handling that stores the download token until expiry.

## Architectural Context

- **Frontend primary adapters:** modal or dedicated step before export.
- **Secondary adapters:** call register-profile API; persist token + expiry in sessionStorage (or memory + sessionStorage).
- **Core:** validation mirroring backend (email format, consent, Other specify).

## Technical Constraints & Clean Code

- Reuse `FormSelect` / existing gender & age options.
- Searchable ISO country list (static dataset in frontend or lightweight API — prefer static ISO list).
- Field of operation fixed enum + Other specify text field.
- Accessibility: labelled fields, required markers, consent associated with checkbox.

## Acceptance Criteria & TDD Checklist

- [x] Component tests: submit disabled until required fields + consent valid.
- [x] Invalid email blocked client-side.
- [x] Successful submit stores session token/expiry.
- [x] Expired session cleared and form required again.
- [x] Privacy/purpose notice visible with consent checkbox.

## Blocked by

- Backend [002](../backend-issues/002-backend-download-profile-registration-and-session-api.md) (can stub API in parallel for UI-first, but contract must match)

## Related

- US-DL-01 · [prd.md](../prd.md)
