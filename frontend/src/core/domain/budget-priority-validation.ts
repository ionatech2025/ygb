import { validatePhone, validateRequired } from '../form-validation';
import type { BudgetPriorityDemographicsFields } from './budget-priority-submission.model';

export interface BudgetPriorityFormErrors {
  fullName?: string;
  phoneNumber?: string;
  ageGroup?: string;
  gender?: string;
  districtId?: string;
  rankedAreas?: string;
}

export function validateBudgetPriorityDemographics(
  demographics: BudgetPriorityDemographicsFields
): BudgetPriorityFormErrors {
  const errors: BudgetPriorityFormErrors = {};

  if (!validateRequired(demographics.fullName).valid) {
    errors.fullName = 'Full name is required.';
  }
  const phoneResult = validatePhone(demographics.phoneNumber);
  if (!phoneResult.valid) {
    errors.phoneNumber = phoneResult.message;
  }
  if (!validateRequired(demographics.gender).valid) {
    errors.gender = 'Gender is required.';
  }
  if (!validateRequired(demographics.ageGroup).valid) {
    errors.ageGroup = 'Age group is required.';
  }
  if (!validateRequired(demographics.districtId).valid) {
    errors.districtId = 'District is required.';
  }

  return errors;
}

export function validateBudgetPriorityForm(
  demographics: BudgetPriorityDemographicsFields,
  rankedAreas: string[]
): BudgetPriorityFormErrors {
  const errors = validateBudgetPriorityDemographics(demographics);

  if (rankedAreas.length === 0) {
    errors.rankedAreas = 'Select at least one priority area.';
  }

  return errors;
}

export function hasBudgetPriorityFormErrors(errors: BudgetPriorityFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
