## Objective

Implement the **LGO Budget Allocation form UI** (US-LGOB-01 / LGO-02, TC-LGOB-01-02): capture prior-FY sectoral allocations, rationale (free text), and recommendations for the coming FY (free text), plus LGO respondent demographics via shared form sections.

## Architectural Context

- **Frontend Domain**:
  - `lgo-budget-allocation-form.model.ts` — `PriorYearAllocationFields`, `LgoBudgetAllocationFormState`, empty defaults, sector list (config-driven JSON until product finalises copy — see [require-polishing.md](../../require-polishing.md)).
  - `lgo-budget-allocation-validation.ts` — client-side validation mirroring backend rules.

- **Ports**:
  - `ILgoBudgetAllocationApiPort` — `submit(payload)` → calls issue `002` backend endpoint.

- **Secondary Adapter**:
  - `HttpLgoBudgetAllocationAdapter` — authenticated POST with bearer token.

- **Components** (`src/adapters/primary/web/lgo-budget-allocation/`):
  - `LgoBudgetAllocationForm.tsx` — orchestrates sections.
  - `LgoPriorYearAllocationsSection.tsx` — sector allocation inputs (amount and/or % per sector).
  - `LgoRationaleSection.tsx` — multi-line rationale field.
  - `LgoRecommendationsSection.tsx` — multi-line recommendations field.
  - Reuse `RespondentSection` + `CascadingLocationSelector` from Epic 2/4.

## Technical Constraints & Clean Code

- **TC-LGOB-01-02:** All three data groups (allocations, rationale, recommendations) required before submit.
- **Reuse:** Shared `FormField`, respondent, and location components — no duplicate validation logic.
- **Offline-ready structure:** Form state serialisable for IndexedDB queue (issue `003`); no direct fetch on submit from this file alone.
- **Accessibility:** Labels, `aria-invalid`, error summaries; min `min-h-11` tap targets.
- Section components each < 150 lines.

## Acceptance Criteria & TDD Checklist

- [x] Unit tests for validation — empty rationale, empty recommendations, no allocation rows → errors.
- [x] Unit tests for payload builder — maps form state to API request shape.
- [x] Adapter test: mocked fetch sends auth header and correct JSON body.
- [x] Component test: form renders allocation, rationale, and recommendation sections.
- [x] Component test: submit with valid data calls port `submit`.
- [x] Component test: validation errors shown inline; submit blocked when invalid.
- [x] Implement domain model, validation, port, adapter, and form sections.

## Blocked by

- [001-frontend-lgo-budget-allocation-collector-shell-and-routing.md](001-frontend-lgo-budget-allocation-collector-shell-and-routing.md)
- Backend [002-backend-lgo-budget-allocation-submission-api.md](../backend-issues/002-backend-lgo-budget-allocation-submission-api.md) (can stub adapter until ready).
