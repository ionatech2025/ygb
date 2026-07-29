import { describe, expect, it } from 'vitest';
import { buildBypSubmissionPayload, validateBypForm } from './byp-validation';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { EMPTY_BYP_FIELDS } from './domain/byp-form.model';

const validRespondent = {
  ...EMPTY_RESPONDENT_FIELDS,
  respondentPhone: '0772111222',
  respondentGender: 'FEMALE',
  respondentAgeGroup: 'AGE_18_24' as const,
  districtId: 'district-1',
  subcountyId: 'subcounty-1',
  parishId: 'parish-1',
  villageId: 'village-1',
};

const validByp = {
  ...EMPTY_BYP_FIELDS,
  fundReceiptDuration: 'ONE_WEEK' as const,
  receivedActualAmountRequested: true,
  cashAmountReceived: 500000,
  instalmentPeriod: 'MONTHLY' as const,
  serviceRating: 'VERY_GOOD' as const,
  performanceRating: 'GOOD' as const,
  groupOrganizedTransparently: true,
  receivedBds: true,
  bdsServices: ['TRAINING' as const],
  improvementSuggestion: 'Provide more technical support.',
};

describe('byp-validation', () => {
  it('allows blank respondent name', () => {
    const errors = validateBypForm({
      respondent: { ...validRespondent, respondentName: '' },
      byp: validByp,
    });
    expect(errors.respondentName).toBeUndefined();
  });

  it('omits exactAge from submission payload', () => {
    const payload = buildBypSubmissionPayload(
      { respondent: { ...validRespondent, respondentName: 'Jane Doe' }, byp: validByp },
      {
        deviceSubmissionId: 'id-1',
        formCompletedAt: '2026-07-28T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload).not.toHaveProperty('exactAge');
    expect(payload.respondentAgeGroup).toBe('AGE_18_24');
    expect(payload.respondentName).toBe('Jane Doe');
  });

  it('requires core BYP survey fields', () => {
    const errors = validateBypForm({
      respondent: validRespondent,
      byp: EMPTY_BYP_FIELDS,
    });
    expect(errors.fundReceiptDuration).toBeTruthy();
    expect(errors.improvementSuggestion).toBeTruthy();
  });
});
