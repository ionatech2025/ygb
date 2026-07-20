## Objective

Build the **shared respondent demographics section** reused by all four survey forms, and implement automatic submission provenance capture. This satisfies **US-FORM-06** (respondent fields + auto-captured collector/timestamp/device ID).

The shared section must include:
- Name of Respondent, Phone Number, Gender, Age Group (and Exact Age where the form requires it — BYP only).
- Cascading District → Sub-county → Parish → Village selectors (US-FORM-07) via the shared `CascadingLocationSelector` component from Epic 4 issue 015.
- On submit, automatically attach `deviceSubmissionId` (`crypto.randomUUID()`), `formCompletedAt` (`new Date().toISOString()`), and collector context from `useAuthStore` — **never** expose manual UI fields for these.

## Architectural Context

- **Frontend Primary Adapters — Components** (`src/adapters/primary/web/components/forms/`):
  - `RespondentSection.tsx` — composes demographic fields + `CascadingLocationSelector`.
  - `buildSubmissionProvenance.ts` — pure helper returning `{ deviceSubmissionId, formCompletedAt, collectorId }` from auth store snapshot.

- **Frontend Domain** (`src/core/domain/`):
  - Extend `submission-payload.model.ts` with a `RespondentFields` type shared across all four form payloads.

- **Integration point**:
  - Each form component (issues 009–012) imports `RespondentSection` and merges its output into the final payload via `buildSubmissionProvenance`.

## Technical Constraints & Clean Code

- **No free-text location**: Location fields must use `CascadingLocationSelector` only — no `<input>` for district/sub-county/parish/village (TC-FORM-07-04). If Epic 4 issue 015 is not yet complete, render a disabled placeholder with a "Location data loading…" message rather than a text input fallback.
- **Distinct device IDs**: Each submit call must generate a fresh `crypto.randomUUID()` — never reuse across submissions in the same session (TC-FORM-06-02).
- **File limits**: `RespondentSection.tsx` under 200 lines; extract gender/phone sub-components if needed.
- **Phone validation**: Reuse `auth.model.ts` phone regex or shared `validatePhone` from issue 006.

## Acceptance Criteria & TDD Checklist

- [x] Component test: all four demographic fields render (Name, Phone, Gender, Age Group) (TC-FORM-06-03 partial).
- [x] Component test: `CascadingLocationSelector` is rendered (not text inputs) for location fields.
- [x] Unit test: `buildSubmissionProvenance` returns a new UUID on each call and a valid ISO timestamp.
- [x] Unit test: provenance includes the authenticated collector's ID from the auth store mock.
- [x] Integration test (with mocked location repo): parent district change clears sub-county/parish/village (TC-FORM-07-03) — may defer to Epic 4 issue 015 if selector not yet available.
- [x] No UI input exists for collector ID, submitted-at, or device submission ID.

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/007-frontend-pdm-entry-and-category-selector.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/007-frontend-pdm-entry-and-category-selector.md)
- Blocked by [epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/015-frontend-offline-location-dataset-and-cascading-dropdowns.md) (for fully functional offline cascading dropdowns — US-FORM-07)
