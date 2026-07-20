import { describe, expect, it } from 'vitest';
import { EMPTY_IYP_FIELDS } from './domain/iyp-form.model';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { buildIypSubmissionPayload, validateIypForm } from './iyp-validation';

describe('iyp-validation', () => {
  const validRespondent = {
    ...EMPTY_RESPONDENT_FIELDS,
    respondentName: 'Jane Doe',
    respondentPhone: '0772111222',
    respondentGender: 'FEMALE',
    respondentAgeGroup: 'AGE_20_24' as const,
    districtId: 'district-1',
    subcountyId: 'subcounty-1',
    parishId: 'parish-1',
    villageId: 'village-1',
  };

  const awareAppliedAccessed: typeof EMPTY_IYP_FIELDS = {
    ...EMPTY_IYP_FIELDS,
    awareOfPdm: true,
    informationChannels: ['RADIO', 'TELEVISION', 'RELATIVES_FRIENDS'],
    eligibleCriteriaAware: true,
    appliedForFund: true,
    accessedFund: true,
    improvementSuggestion: 'Provide more community outreach sessions.',
  };

  it('payload arrays contain all selected values (TC-FORM-11-02)', () => {
    const notApplied: typeof EMPTY_IYP_FIELDS = {
      ...awareAppliedAccessed,
      appliedForFund: false,
      accessedFund: null,
      reasonsForNotApplying: ['NOT_ELIGIBLE', 'LACK_OF_INFORMATION'],
      difficultiesFaced: ['LIMITATION_IN_AMOUNT', 'LONG_PROCESSING_TIME'],
      limitationExplanation: 'The amount offered was too low for my needs.',
    };

    const payload = buildIypSubmissionPayload(
      { respondent: validRespondent, iyp: notApplied },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.informationChannels).toEqual(['RADIO', 'TELEVISION', 'RELATIVES_FRIENDS']);
    expect(payload.reasonsForNotApplying).toEqual(['NOT_ELIGIBLE', 'LACK_OF_INFORMATION']);
    expect(payload.difficultiesFaced).toEqual(['LIMITATION_IN_AMOUNT', 'LONG_PROCESSING_TIME']);
    expect(payload.limitationExplanation).toBe('The amount offered was too low for my needs.');
  });

  it('produces a payload matching IypSubmissionRequestDto shape for unaware branch', () => {
    const unaware = {
      ...EMPTY_IYP_FIELDS,
      awareOfPdm: false,
      improvementSuggestion: 'Make information more accessible in rural areas.',
    };

    const payload = buildIypSubmissionPayload(
      { respondent: validRespondent, iyp: unaware },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload).toMatchObject({
      formType: 'IYP',
      awareOfPdm: false,
      eligibleCriteriaAware: null,
      appliedForFund: null,
      informationChannels: null,
      improvementSuggestion: 'Make information more accessible in rural areas.',
    });
  });

  it('requires limitation explanation when LIMITATION_IN_AMOUNT is selected', () => {
    const errors = validateIypForm({
      respondent: validRespondent,
      iyp: {
        ...awareAppliedAccessed,
        difficultiesFaced: ['LIMITATION_IN_AMOUNT'],
        limitationExplanation: '',
      },
    });
    expect(errors.limitationExplanation).toBeTruthy();
  });
});
