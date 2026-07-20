import type { AuthProvenanceSnapshot, SubmissionProvenance } from '../../../../../core/domain/respondent-fields.model';

export function buildSubmissionProvenance(snapshot: AuthProvenanceSnapshot): SubmissionProvenance {
  return {
    deviceSubmissionId: crypto.randomUUID(),
    formCompletedAt: new Date().toISOString(),
    collectorId: snapshot.collectorId,
  };
}

export function buildAuthProvenanceSnapshot(collectorId: string | null | undefined): AuthProvenanceSnapshot {
  if (!collectorId) {
    throw new Error('Authenticated collector is required to submit a survey.');
  }
  return { collectorId };
}
