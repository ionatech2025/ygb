import { validateNarrativeText, validatePhone, validateRequired } from '../form-validation';
import { parseFundAmount } from '../lgo-validation';
import type { RespondentFields } from './respondent-fields.model';
import {
  LGO_BUDGET_ALLOCATION_SECTORS,
  parseAllocationPercentage,
  type LgoBudgetAllocationFormState,
  type PriorYearAllocationFields,
} from './lgo-budget-allocation-form.model';

export type LgoBudgetAllocationFormErrors = Record<string, string>;

function validateRespondent(respondent: RespondentFields, errors: LgoBudgetAllocationFormErrors): void {
  if (!validateRequired(respondent.respondentName).valid) {
    errors.respondentName = 'Name of respondent is required.';
  }
  const phoneResult = validatePhone(respondent.respondentPhone);
  if (!phoneResult.valid) {
    errors.respondentPhone = phoneResult.message ?? 'Invalid phone number.';
  }
  if (!respondent.respondentGender) {
    errors.respondentGender = 'Gender is required.';
  }
  if (!respondent.respondentAgeGroup) {
    errors.respondentAgeGroup = 'Age group is required.';
  }
  if (!respondent.districtId) {
    errors.districtId = 'District is required.';
  }
  if (!respondent.subcountyId) {
    errors.subcountyId = 'Sub-county is required.';
  }
  if (!respondent.parishId) {
    errors.parishId = 'Parish is required.';
  }
  if (!respondent.villageId) {
    errors.villageId = 'Village is required.';
  }
}

function validatePriorYearAllocations(
  allocations: PriorYearAllocationFields,
  errors: LgoBudgetAllocationFormErrors
): void {
  let completedSectorCount = 0;

  for (const sector of LGO_BUDGET_ALLOCATION_SECTORS) {
    const row = allocations[sector.id];
    const amountText = row.amount.trim();
    const percentageText = row.percentage.trim();

    if (amountText === '' && percentageText === '') {
      continue;
    }

    const amount = parseFundAmount(row.amount);
    if (amount == null || amount <= 0) {
      errors[`allocation-${sector.id}-amount`] = `Enter a valid amount for ${sector.label.toLowerCase()}.`;
      continue;
    }

    if (percentageText !== '') {
      const percentage = parseAllocationPercentage(row.percentage);
      if (percentage == null) {
        errors[`allocation-${sector.id}-percentage`] = 'Enter a percentage between 0 and 100.';
        continue;
      }
    }

    completedSectorCount += 1;
  }

  if (completedSectorCount === 0) {
    errors.priorYearAllocations = 'Enter at least one sector allocation for the previous financial year.';
  }
}

export function validateLgoBudgetAllocationForm(state: LgoBudgetAllocationFormState): LgoBudgetAllocationFormErrors {
  const errors: LgoBudgetAllocationFormErrors = {};

  validateRespondent(state.respondent, errors);
  validatePriorYearAllocations(state.priorYearAllocations, errors);

  const rationaleResult = validateNarrativeText(state.rationale, { required: true });
  if (!rationaleResult.valid) {
    errors.rationale = rationaleResult.message ?? 'Rationale is required.';
  }

  const recommendationsResult = validateNarrativeText(state.recommendations, { required: true });
  if (!recommendationsResult.valid) {
    errors.recommendations = recommendationsResult.message ?? 'Recommendations are required.';
  }

  return errors;
}

export function hasLgoBudgetAllocationFormErrors(errors: LgoBudgetAllocationFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
