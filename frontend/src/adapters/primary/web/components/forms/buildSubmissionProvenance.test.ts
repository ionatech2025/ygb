import { describe, expect, it, vi } from 'vitest';
import {
  buildAuthProvenanceSnapshot,
  buildSubmissionProvenance,
} from './buildSubmissionProvenance';

describe('buildSubmissionProvenance', () => {
  it('returns a new UUID on each call and a valid ISO timestamp', () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('11111111-1111-1111-1111-111111111111')
      .mockReturnValueOnce('22222222-2222-2222-2222-222222222222');

    const first = buildSubmissionProvenance({ collectorId: 'collector-1' });
    const second = buildSubmissionProvenance({ collectorId: 'collector-1' });

    expect(first.deviceSubmissionId).toBe('11111111-1111-1111-1111-111111111111');
    expect(second.deviceSubmissionId).toBe('22222222-2222-2222-2222-222222222222');
    expect(first.deviceSubmissionId).not.toBe(second.deviceSubmissionId);
    expect(Date.parse(first.formCompletedAt)).not.toBeNaN();
    expect(first.formCompletedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('includes the authenticated collector id from the auth snapshot', () => {
    const snapshot = buildAuthProvenanceSnapshot('22222222-2222-2222-2222-222222222222');
    const provenance = buildSubmissionProvenance(snapshot);

    expect(provenance.collectorId).toBe('22222222-2222-2222-2222-222222222222');
  });

  it('throws when collector id is missing', () => {
    expect(() => buildAuthProvenanceSnapshot(null)).toThrow(/authenticated collector/i);
  });
});
