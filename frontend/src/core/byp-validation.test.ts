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
  fundsReceiptWaitAfterApplied: 'It took about three weeks after I applied.',
  moneyUsedFor: 'I used the money to buy farming inputs and livestock feed.',
  serviceRating: 'VERY_GOOD' as const,
  loanRepaid: true,
  loanRepaymentDuration: 'TWELVE_TO_EIGHTEEN_MONTHS' as const,
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

  it('omits exactAge and instalment period from submission payload', () => {
    const payload = buildBypSubmissionPayload(
      { respondent: { ...validRespondent, respondentName: 'Jane Doe' }, byp: validByp },
      {
        deviceSubmissionId: 'id-1',
        formCompletedAt: '2026-07-28T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload).not.toHaveProperty('exactAge');
    expect(payload).not.toHaveProperty('instalmentPeriod');
    expect(payload).not.toHaveProperty('instalmentPeriodSpecify');
    expect(payload.respondentAgeGroup).toBe('AGE_18_24');
    expect(payload.respondentName).toBe('Jane Doe');
    expect(payload.fundsReceiptWaitAfterApplied).toContain('three weeks');
    expect(payload.moneyUsedFor).toContain('farming inputs');
    expect(payload.loanRepaid).toBe(true);
    expect(payload.loanRepaymentDuration).toBe('TWELVE_TO_EIGHTEEN_MONTHS');
  });

  it('requires core BYP survey fields including remodeled Q4 and loan repayment', () => {
    const errors = validateBypForm({
      respondent: validRespondent,
      byp: EMPTY_BYP_FIELDS,
    });
    expect(errors.fundReceiptDuration).toBeTruthy();
    expect(errors.fundsReceiptWaitAfterApplied).toBeTruthy();
    expect(errors.moneyUsedFor).toBeTruthy();
    expect(errors.loanRepaid).toBeTruthy();
    expect(errors.improvementSuggestion).toBeTruthy();
  });

  it('requires repayment duration only when the loan has been repaid', () => {
    const unpaidErrors = validateBypForm({
      respondent: validRespondent,
      byp: { ...validByp, loanRepaid: false, loanRepaymentDuration: '' },
    });
    expect(unpaidErrors.loanRepaymentDuration).toBeUndefined();

    const repaidErrors = validateBypForm({
      respondent: validRespondent,
      byp: { ...validByp, loanRepaid: true, loanRepaymentDuration: '' },
    });
    expect(repaidErrors.loanRepaymentDuration).toBeTruthy();
  });

  it('omits repayment duration from payload when loan is not repaid', () => {
    const payload = buildBypSubmissionPayload(
      {
        respondent: validRespondent,
        byp: { ...validByp, loanRepaid: false, loanRepaymentDuration: 'ZERO_TO_SIX_MONTHS' },
      },
      {
        deviceSubmissionId: 'id-1',
        formCompletedAt: '2026-07-28T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.loanRepaid).toBe(false);
    expect(payload.loanRepaymentDuration).toBeNull();
  });

  it('requires Others specify when OTHERS BDS is selected', () => {
    const errors = validateBypForm({
      respondent: validRespondent,
      byp: {
        ...validByp,
        bdsServices: ['OTHERS'],
        bdsServicesOthersSpecify: '',
      },
    });
    expect(errors.bdsServicesOthersSpecify).toBeTruthy();
  });

  it('encodes Others specify into bdsServices payload', () => {
    const payload = buildBypSubmissionPayload(
      {
        respondent: validRespondent,
        byp: {
          ...validByp,
          bdsServices: ['TRAINING', 'OTHERS'],
          bdsServicesOthersSpecify: 'Mentorship from parish enterprise coaches',
        },
      },
      {
        deviceSubmissionId: 'id-1',
        formCompletedAt: '2026-07-28T10:00:00.000Z',
        collectorId: 'collector-1',
      }
    );

    expect(payload.bdsServices).toEqual([
      'TRAINING',
      'OTHERS:Mentorship from parish enterprise coaches',
    ]);
    expect(payload).not.toHaveProperty('bdsServicesOthersSpecify');
  });

  it('accepts short duration answers of at least 5 characters', () => {
    const errors = validateBypForm({
      respondent: validRespondent,
      byp: {
        ...validByp,
        fundReceiptDuration: 'MONTHS',
        fundReceiptDurationSpecify: '4 mos',
        fundsReceiptWaitAfterApplied: '2 days',
      },
    });
    expect(errors.fundReceiptDurationSpecify).toBeUndefined();
    expect(errors.fundsReceiptWaitAfterApplied).toBeUndefined();
  });

  it('rejects duration answers shorter than 5 characters', () => {
    const errors = validateBypForm({
      respondent: validRespondent,
      byp: {
        ...validByp,
        fundReceiptDuration: 'MONTHS',
        fundReceiptDurationSpecify: '4',
        fundsReceiptWaitAfterApplied: '10mo',
      },
    });
    expect(errors.fundReceiptDurationSpecify).toMatch(/at least 5/);
    expect(errors.fundsReceiptWaitAfterApplied).toMatch(/at least 5/);
  });
});
