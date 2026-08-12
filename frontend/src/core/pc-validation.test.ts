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
    respondentAgeGroup: 'AGE_ABOVE_35' as const,
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
    youngWomenBeneficiaries: '22',
    youngMenBeneficiaries: '18',
    obstaclesDescription: 'Lack of transport equipment is the main obstacle.',
    spendingTargetedToMostInNeed: true,
    pdcTotalMembers: '7',
    pdcYouthMembers: '3',
    pdcWomenMembers: '4',
    pdcTrainingReceived: true,
    pdcTrainingAreas: ['FINANCIAL_LITERACY', 'BUSINESS_PLANNING'],
    pdcEffectivenessRating: 'VERY_EFFECTIVE',
    programmeMonitored: true,
    monitoredBy: ['CAO', 'PDM_SECRETARIAT'],
    monitoredByOthersSpecify: '',
    monitoringMethod: 'Regular field checks performed by the parish team.',
    reportSharedWithRespondent: true,
    improvementsSeen: false,
    improvementsSeenExplanation: '',
    progressReportsSubmitted: false,
    progressReportsSubmittedExplanation: '',
    selfRelianceBeneficiariesCount: '10',
    selfRelianceStableIncomeCount: '6',
    selfRelianceTrainedCount: '12',
    selfRelianceGroupProjectsCount: '8',
    programmeImprovementSuggestion: 'Provide more monitoring tools for parish chiefs.',
  };

  it('payload includes Q15, Q24, Q25 fields and programme improvement narrative', () => {
    const payload = buildPcSubmissionPayload(
      { respondent: validRespondent, pc: validPc },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.youngMenBeneficiaries).toBe(18);
    expect(payload.pdcEffectivenessRating).toBe('VERY_EFFECTIVE');
    expect(payload.programmeMonitored).toBe(true);
    expect(payload.selfRelianceStableIncomeCount).toBe(6);
    expect(payload.selfRelianceTrainedCount).toBe(12);
    expect(payload.programmeImprovementSuggestion).toBe('Provide more monitoring tools for parish chiefs.');
  });

  it('monitoredBy array empty when programmeMonitored is false', () => {
    const payload = buildPcSubmissionPayload(
      { respondent: validRespondent, pc: { ...validPc, programmeMonitored: false, monitoredBy: ['CAO'] } },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.programmeMonitored).toBe(false);
    expect(payload.monitoredBy).toEqual([]);
  });

  it('requires programmeMonitored answer Q15', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        programmeMonitored: null,
      },
    });
    expect(errors.programmeMonitored).toBeTruthy();
  });

  it('monitoredBy array persisted with all checked values when programmeMonitored is true', () => {
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

  it('requires monitoredByOthersSpecify when OTHERS is selected and programmeMonitored is true', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        programmeMonitored: true,
        monitoredBy: ['OTHERS'],
        monitoredByOthersSpecify: '',
      },
    });
    expect(errors.monitoredByOthersSpecify).toBeTruthy();
  });

  it('validates Q24 and Q25 whole numbers', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        selfRelianceStableIncomeCount: 'invalid',
        selfRelianceTrainedCount: '-5',
      },
    });
    expect(errors.selfRelianceStableIncomeCount).toBeTruthy();
    expect(errors.selfRelianceTrainedCount).toBeTruthy();
  });

  it('rejects young women and young men counts that exceed youth beneficiaries', () => {
    const errors = validatePcForm({
      respondent: validRespondent,
      pc: {
        ...validPc,
        youthBeneficiaries: '30',
        youngWomenBeneficiaries: '20',
        youngMenBeneficiaries: '15',
      },
    });
    expect(errors.youngMenBeneficiaries).toBeTruthy();
  });
});

