import { describe, expect, it } from 'vitest';
import { EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS } from './budget-priority-submission.model';
import {
  hasBudgetPriorityFormErrors,
  validateBudgetPriorityDemographics,
  validateBudgetPriorityForm,
} from './budget-priority-validation';

const validDemographics = {
  fullName: 'Jane Citizen',
  phoneNumber: '0772123456',
  ageGroup: 'AGE_20_24' as const,
  gender: 'FEMALE' as const,
  districtId: 'district-1',
};

describe('budget-priority-validation', () => {
  it('fails when no priority areas are selected', () => {
    const errors = validateBudgetPriorityForm(validDemographics, []);

    expect(errors.rankedAreas).toBe('Select at least one priority area.');
    expect(hasBudgetPriorityFormErrors(errors)).toBe(true);
  });

  it('fails when phone number is invalid', () => {
    const errors = validateBudgetPriorityForm(
      { ...validDemographics, phoneNumber: '123' },
      ['PRIMARY_HEALTH_CARE']
    );

    expect(errors.phoneNumber).toMatch(/valid Uganda phone number/i);
    expect(hasBudgetPriorityFormErrors(errors)).toBe(true);
  });

  it('passes for a valid demographics and priority selection', () => {
    const errors = validateBudgetPriorityForm(validDemographics, ['PRIMARY_HEALTH_CARE']);

    expect(errors).toEqual({});
    expect(hasBudgetPriorityFormErrors(errors)).toBe(false);
  });

  it('requires all demographic fields', () => {
    const errors = validateBudgetPriorityDemographics(EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS);

    expect(errors.fullName).toBeDefined();
    expect(errors.phoneNumber).toBeDefined();
    expect(errors.gender).toBeDefined();
    expect(errors.ageGroup).toBeDefined();
    expect(errors.districtId).toBeDefined();
  });
});
