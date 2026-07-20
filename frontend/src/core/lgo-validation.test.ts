import { describe, expect, it } from 'vitest';
import { EMPTY_LGO_FIELDS } from './domain/lgo-form.model';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { buildLgoSubmissionPayload, validateLgoForm } from './lgo-validation';

describe('lgo-validation', () => {
  const validRespondent = {
    ...EMPTY_RESPONDENT_FIELDS,
    respondentName: 'Official Name',
    respondentPhone: '0772111444',
    respondentGender: 'FEMALE',
    respondentAgeGroup: 'AGE_30_AND_ABOVE' as const,
    districtId: 'district-1',
    subcountyId: 'subcounty-1',
    parishId: 'parish-1',
    villageId: 'village-1',
  };

  const validLgo: typeof EMPTY_LGO_FIELDS = {
    ...EMPTY_LGO_FIELDS,
    selectedFiscalYearLabel: '2022/23',
    fiscalYearRecord: {
      fiscalYearLabel: '2022/23',
      expectedFunds: '1000000',
      actualFunds: '900000',
      totalBeneficiaryCount: '50',
      youngPeopleCount: '20',
      youngWomenCount: '15',
      totalParishesCount: '10',
      fundedParishesCount: '8',
    },
    fundsAllocatedEquitably: true,
    allocatedFundsSufficient: true,
    adequateUtilisationOversight: true,
    transparentBeneficiarySelection: true,
    fundsSpentAsRequired: true,
    economicTransformation: true,
    improvementSuggestion: 'Provide more monitoring tools for local governments.',
  };

  it('payload fiscalYearRecords array matches backend FiscalYearRecord JSON shape', () => {
    const payload = buildLgoSubmissionPayload(
      { respondent: validRespondent, lgo: validLgo },
      {
        deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
        formCompletedAt: '2026-07-20T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.fiscalYearRecords).toHaveLength(1);
    expect(payload.fiscalYearRecords[0]).toEqual({
      fiscalYearLabel: '2022/23',
      expectedFunds: 1000000,
      actualFunds: 900000,
      totalBeneficiaryCount: 50,
      youngPeopleCount: 20,
      youngWomenCount: 15,
      totalParishesCount: 10,
      fundedParishesCount: 8,
    });
    expect(payload.fundsAllocatedEquitably).toBe(true);
    expect(payload.transparentBeneficiarySelection).toBe(true);
    expect(payload.fundsSpentExplanation).toBeNull();
    expect(payload.economicTransformationExplanation).toBeNull();
  });

  it('requires fiscal year selection before submit', () => {
    const errors = validateLgoForm({
      respondent: validRespondent,
      lgo: { ...validLgo, selectedFiscalYearLabel: '' },
    });
    expect(errors.selectedFiscalYearLabel).toBeTruthy();
  });

  it('requires funds spent explanation when Q8 is No (TC-FORM-12-03)', () => {
    const errors = validateLgoForm({
      respondent: validRespondent,
      lgo: {
        ...validLgo,
        fundsSpentAsRequired: false,
        fundsSpentExplanation: 'Too short',
      },
    });
    expect(errors.fundsSpentExplanation).toBeTruthy();
  });

  it('blocks non-numeric fund input (TC-FORM-04-03)', () => {
    const errors = validateLgoForm({
      respondent: validRespondent,
      lgo: {
        ...validLgo,
        fiscalYearRecord: { ...validLgo.fiscalYearRecord, expectedFunds: 'abc' },
      },
    });
    expect(errors['expectedFunds-2022-23']).toMatch(/valid numeric/i);
  });
});
