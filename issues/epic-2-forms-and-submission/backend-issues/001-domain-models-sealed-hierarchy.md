## Objective

Implement the core Domain Entities and Value Objects for the survey submissions, establishing a clean, sealed domain model hierarchy to self-validate all forms and business invariants without framework dependencies.

## Architectural Context

- **Core Domain**: 
  - Abstract base class: `Submission`
  - Sealed subclasses: `BypSubmission` (Beneficiary Young Person), `IypSubmission` (Individual Young Person), `LgoSubmission` (Local Government Official), `PcSubmission` (Parish Chief).
  - Common Value Objects: `SubmissionMetadata` (collectorId, deviceSubmissionId, formCompletedAt), `Location` (districtId, subcountyId, parishId, villageId), `FinancialYearPeriod` (Jan-Jun vs Jul-Dec derivation), `SubmissionStatus` (PENDING, SYNCED, FLAGGED, REJECTED).
  - Specific Value Objects: `Age` (numeric, age >= 15), `AgeGroup` enum (excluding < 15), `NarrativeText` (enforcing >= 10 chars), `Rating` enum (VERY_GOOD, GOOD, FAIR, POOR, VERY_POOR), `FiscalYearRecord` (LGO dynamic financial year data).

## Technical Constraints & Clean Code

- **Pure Java**: Zero dependencies on Spring, JPA, Hibernate, or other third-party frameworks.
- **Decongestion**: Maintain the GEMINI rule limiting files in the backend to **under 200 lines** wherever practical. Decompose nested models if they grow too large.
- **Self-Validation**: Invariants must be validated inside the constructor or via a dedicated `validate()` method in the respective Entity, throwing a specific domain exception (e.g., `DomainValidationException`) upon violation.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Domain Tests** for `Age` value object (verifies exception if < 15, passes if >= 15).
- [ ] Write **Domain Tests** for `NarrativeText` value object (verifies exception if < 10 characters).
- [ ] Write **Domain Tests** for `FinancialYearPeriod` derivation based on completed timestamp.
- [ ] Write **Domain Tests** for `BypSubmission` validating service ratings and conditional logic branches.
- [ ] Write **Domain Tests** for `IypSubmission` validating conditional show/hide logic (e.g., rejection explanation required only if applied and rejected).
- [ ] Write **Domain Tests** for `LgoSubmission` validating dynamic list of `FiscalYearRecord` entries.
- [ ] Write **Domain Tests** for `PcSubmission` validating PDC training areas and monitoring details.
- [ ] Implement entities and value objects to pass the domain tests.
- [ ] Refactor codebase to ensure small methods (< 20 lines) and readability.

## Blocked by

None - can start immediately.
