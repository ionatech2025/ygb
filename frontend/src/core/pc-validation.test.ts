import { describe, expect, it } from 'vitest';
import { EMPTY_PC_FIELDS } from './domain/pc-form.model';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { buildPcSubmissionPayload, validatePcForm } from './pc-validation';

describe('pc-validation', () => {
  const validRespondent = {
    ...EMPTY_RESPONDENT_FIELDS,
    respondentName: 'Parish Chief Name',
    respondentPhone: '0772111555',
    respondentGender: 'MALE',
    respondentAgeGroup: 'AGE_30_AND_ABOVE' as const,
    districtId: 'district-1',
    subcountyId: 'subcounty-1',
    parishId: 'parish-1',
    villageId: 'village-1',
  };

  const validPc: typeof EMPTY_PC_FIELDS = {
    ...EMPTY_PC_FIELDS,
    amountExpected: '1500000',
    amountReceived: '1500000',
    totalBeneficiaries: '100',
    youthBeneficiaries: '40',
    youngWomenBeneficiaries: '30',
    obstaclesDescription: 'Lack of transport equipment is the main obstacle.',
    spendingTargetedToMostInNeed: true,
    pdcTotalMembers: '7',
    pdcYouthMembers: '3',
    pdcWomenMembers: '4',
    pdcTrainingReceived: true,
    pdcTrainingAreas: ['FINANCIAL_LITERACY', 'BUSINESS_PLANNING'],
    pdcEffectivenessRating: 'FULLY',
    monitoredBy: ['CAO', 'PDM_SECRETARIAT'],
    monitoredByOthersSpecify: '',
    monitoringMethod: 'Regular field checks performed by the parish team.',
    reportSharedWithRespondent: true,
    improvementsSeen: false,
    improvementsSeenExplanation: '',
    progressReportsSubmitted: false,
    progressReportsSubmittedExplanation: '',
    selfRelianceBeneficiariesCount: '10',
    selfRelianceGroupProjectsCount: '8',
  };

  it('monitoredBy array persisted with all checked values', () => {
    const payload = buildPcSubmissionPayload(
      { respondent: validRespondent, pc: validPc },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.monitoredBy).toEqual(['CAO', 'PDM_SECRETARIAT']);
    expect(payload.pdcTrainingAreas).toEqual(['FINANCIAL_LITERACY', 'BUSINESS_PLANNING']);
  });

  it('narrative fields enforce at least 10 characters (TC-FORM-12-03)', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        obstaclesDescription: 'Too short',
        monitoringMethod: 'Short',
      },
    });
    expect(errors.obstaclesDescription).toBeTruthy();
    expect(errors.monitoringMethod).toBeTruthy();
  });

  it('requires monitoredByOthersSpecify when OTHERS is selected', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        monitoredBy: ['OTHERS'],
        monitoredByOthersSpecify: '',
      },
    });
    expect(errors.monitoredByOthersSpecify).toBeTruthy();
  });
});
