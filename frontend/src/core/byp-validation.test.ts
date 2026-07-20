import { describe, expect, it, vi } from 'vitest';
import { EMPTY_BYP_FIELDS } from './domain/byp-form.model';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { buildBypSubmissionPayload, validateBypForm } from './byp-validation';

describe('byp-validation', () => {
  const validRespondent = {
    ...EMPTY_RESPONDENT_FIELDS,
    respondentName: 'Jane Doe',
    respondentPhone: '0772111222',
    respondentGender: 'FEMALE',
    respondentAgeGroup: 'AGE_20_24' as const,
    exactAge: 22,
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

  it('blocks age below 15 (TC-FORM-10-01)', () => {
    const errors = validateBypForm({
      respondent: { ...validRespondent, exactAge: 12 },
      byp: validByp,
    });
    expect(errors.exactAge).toBeTruthy();
  });

  it('accepts age 15 (TC-FORM-10-02)', () => {
    const errors = validateBypForm({
      respondent: { ...validRespondent, exactAge: 15 },
      byp: validByp,
    });
    expect(errors.exactAge).toBeUndefined();
  });

  it('produces a payload matching BypSubmissionRequestDto shape', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-1111-1111-111111111111');

    const payload = buildBypSubmissionPayload(
      { respondent: validRespondent, byp: validByp },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload).toMatchObject({
      formType: 'BYP',
      deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
      respondentName: 'Jane Doe',
      exactAge: 22,
      fundReceiptDuration: 'ONE_WEEK',
      serviceRating: 'VERY_GOOD',
      bdsServices: ['TRAINING'],
    });
    expect(payload).not.toHaveProperty('collectorId');
  });
});
