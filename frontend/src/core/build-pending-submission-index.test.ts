import { describe, expect, it } from 'vitest';
import { buildPendingSubmissionIndexFields, extractRespondentPhoneFromPayload } from './build-pending-submission-index';

describe('build-pending-submission-index LGO budget allocation', () => {
  it('extracts respondent phone from nested LGO budget allocation payload', () => {
    expect(
      extractRespondentPhoneFromPayload({
        respondent: { phone: '0772555666' },
        formCompletedAt: '2026-03-15T10:00:00.000Z',
      })
    ).toBe('0772555666');
  });

  it('derives index fields for queued LGO budget allocation payload', () => {
    const fields = buildPendingSubmissionIndexFields(
      {
        respondent: { phone: '0772555666' },
        formCompletedAt: '2026-03-15T10:00:00.000Z',
      },
      '2026-03-15T10:00:00.000Z'
    );

    expect(fields).toEqual({
      respondentPhone: '0772555666',
      financialYearPeriod: 'JAN_JUN_2026',
    });
  });
});
