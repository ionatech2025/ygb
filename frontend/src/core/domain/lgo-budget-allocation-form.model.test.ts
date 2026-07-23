import { describe, expect, it } from 'vitest';
import {
  buildLgoBudgetAllocationSubmissionPayload,
  EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
} from './lgo-budget-allocation-form.model';
import type { SubmissionProvenance } from './respondent-fields.model';

const provenance: SubmissionProvenance = {
  deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
  formCompletedAt: '2026-03-15T10:00:00.000Z',
  collectorId: '22222222-2222-2222-2222-222222222222',
};

describe('lgo-budget-allocation-form.model', () => {
  it('builds API payload from form state and provenance', () => {
    const payload = buildLgoBudgetAllocationSubmissionPayload(
      {
        ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
        respondent: {
          ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE.respondent,
          respondentName: 'District Health Officer',
          respondentPhone: '0772555666',
          respondentGender: 'FEMALE',
          respondentAgeGroup: 'AGE_30_AND_ABOVE',
          districtId: 'district-1',
          subcountyId: 'subcounty-1',
          parishId: 'parish-1',
          villageId: 'village-1',
        },
        priorYearAllocations: {
          ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE.priorYearAllocations,
          health: { amount: '1200000', percentage: '28' },
          education: { amount: '900000', percentage: '22' },
        },
        rationale: 'Health and education received the largest shares due to service delivery gaps.',
        recommendations: 'Increase agriculture extension funding and climate resilience programmes.',
      },
      provenance
    );

    expect(payload.deviceSubmissionId).toBe(provenance.deviceSubmissionId);
    expect(payload.formCompletedAt).toBe(provenance.formCompletedAt);
    expect(payload.respondent).toEqual({
      name: 'District Health Officer',
      phone: '0772555666',
      gender: 'FEMALE',
      ageGroup: 'AGE_30_AND_ABOVE',
      districtId: 'district-1',
      subcountyId: 'subcounty-1',
      parishId: 'parish-1',
      villageId: 'village-1',
    });
    expect(payload.priorYearAllocations).toEqual({
      health: { amount: 1_200_000, percentage: 28 },
      education: { amount: 900_000, percentage: 22 },
    });
    expect(payload.rationale).toContain('Health and education');
    expect(payload.recommendations).toContain('agriculture extension');
  });

  it('omits empty sector rows from priorYearAllocations', () => {
    const payload = buildLgoBudgetAllocationSubmissionPayload(
      {
        ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
        respondent: {
          ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE.respondent,
          respondentName: 'Officer',
          respondentPhone: '0772555666',
          respondentGender: 'FEMALE',
          respondentAgeGroup: 'AGE_30_AND_ABOVE',
          districtId: 'district-1',
          subcountyId: 'subcounty-1',
          parishId: 'parish-1',
          villageId: 'village-1',
        },
        priorYearAllocations: {
          ...EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE.priorYearAllocations,
          agriculture: { amount: '600000', percentage: '' },
        },
        rationale: 'Valid rationale text here.',
        recommendations: 'Valid recommendations text here.',
      },
      provenance
    );

    expect(payload.priorYearAllocations).toEqual({
      agriculture: { amount: 600_000 },
    });
  });
});
