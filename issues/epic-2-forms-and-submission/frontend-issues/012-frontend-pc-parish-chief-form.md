## Objective

Implement the full **Parish Chief (PC)** parish-level monitoring form UI with all five sections, multi-select monitoring fields, conditional explain fields, and numeric self-reliance indicators. On valid submit, build a `PcSubmissionPayload` matching `PcSubmissionRequestDto`. This satisfies **US-FORM-05**.

## Architectural Context

- **Frontend Primary Adapters — Forms** (`src/adapters/primary/web/forms/pc/`):
  - `PcForm.tsx` — main orchestrator.
  - `PcFundsReceiptSection.tsx` — amount expected/received, beneficiary counts.
  - `PcAccessSection.tsx` — obstacles description, spending targeted to most in need.
  - `PcPdcSection.tsx` — PDC composition counts, training received + conditional training areas list, effectiveness rating.
  - `PcMonitoringSection.tsx` — who monitored (multi-select + Other-specify), monitoring method, report shared.
  - `PcSelfRelianceSection.tsx` — improvements seen, progress reports, self-reliance counts.

- **Payload mapping**: Output must match `backend/.../dto/PcSubmissionRequestDto.java`.

## Section structure (from US-FORM-05)

Sections must appear in order:
1. PDM Funds Receipt
2. Access to PDM Fund
3. PDC
4. Monitoring & Oversight
5. Self-reliance

## Conditional rules

| Trigger | Effect |
|---------|--------|
| PDC training received = Yes | Show training areas list; require ≥ 1 entry (TC-FORM-05-02) |
| Monitored by includes "Others (specify)" | Show and require specify text (TC-FORM-05-03) |
| Improvements seen = Yes | Show "in what areas" explanation, required |
| Progress reports submitted = Yes | Show "to whom and when" explanation, required |

## Technical Constraints & Clean Code

- **Multi-select**: `monitoredBy` and `pdcTrainingAreas` output as string arrays (US-FORM-11).
- **Numeric fields**: Amount expected/received, beneficiary counts, PDC member counts, self-reliance counts — all numeric validation.
- **Submit flow**: validate → build payload → `enqueue` → confirmation → return to entry screen.
- **File limits**: Each section under 200 lines.

## Acceptance Criteria & TDD Checklist

- [x] Component test: five sections render in correct order (TC-FORM-05-01).
- [x] Component test: PDC training = Yes requires ≥ 1 training area (TC-FORM-05-02).
- [x] Component test: "Others (specify)" in monitored-by shows required text field (TC-FORM-05-03).
- [x] Component test: full valid submission calls `enqueue` with complete payload (TC-FORM-05-04).
- [x] Unit test: `monitoredBy` array persisted with all checked values.
- [x] Narrative fields (obstacles, monitoring method) enforce ≥ 10 chars (TC-FORM-12-03).

## Blocked by

- Blocked by [epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/006-frontend-shared-form-foundation.md)
- Blocked by [epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-2-forms-and-submission/frontend-issues/008-frontend-shared-respondent-section-and-provenance.md)
- Blocked by [epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md](file:///d:/2026/WORK/Software/sourcecode/work/1.%20iONA/webapps/ygb/issues/epic-4-offline-sync/frontend-issues/012-frontend-indexeddb-submission-queue.md)
