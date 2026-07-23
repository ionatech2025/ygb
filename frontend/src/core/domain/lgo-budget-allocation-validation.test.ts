import { describe, expect, it } from 'vitest';
import {
  EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE,
  type LgoBudgetAllocationFormState,
} from './lgo-budget-allocation-form.model';
import {
  hasLgoBudgetAllocationFormErrors,
  validateLgoBudgetAllocationForm,
} from './lgo-budget-allocation-validation';

function validState(overrides: Partial<LgoBudgetAllocationFormState> = {}): LgoBudgetAllocationFormState {
  return {
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
    },
    rationale: 'Health and education received the largest shares due to service delivery gaps.',
    recommendations: 'Increase agriculture extension funding and climate resilience programmes.',
    ...overrides,
  };
}

describe('lgo-budget-allocation-validation', () => {
  it('accepts a complete form state', () => {
    const errors = validateLgoBudgetAllocationForm(validState());
    expect(hasLgoBudgetAllocationFormErrors(errors)).toBe(false);
  });

  it('requires rationale text', () => {
    const errors = validateLgoBudgetAllocationForm(validState({ rationale: '   ' }));
    expect(errors.rationale).toBeTruthy();
  });

  it('requires recommendations text', () => {
    const errors = validateLgoBudgetAllocationForm(validState({ recommendations: '' }));
    expect(errors.recommendations).toBeTruthy();
  });

  it('requires at least one sector allocation row', () => {
    const errors = validateLgoBudgetAllocationForm(
      validState({ priorYearAllocations: EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE.priorYearAllocations })
    );
    expect(errors.priorYearAllocations).toMatch(/at least one sector allocation/i);
  });
});
