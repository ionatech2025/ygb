import type { RespondentFields } from './domain/respondent-fields.model';
import { validatePhone } from './form-validation';

/** Shared respondent demographics validation for all four PDM collector forms. */
export function validateRespondentDemographics(
  respondent: RespondentFields,
  errors: Record<string, string>
): void {
  if (!validatePhone(respondent.respondentPhone).valid) {
    errors.respondentPhone =
      validatePhone(respondent.respondentPhone).message ?? 'Invalid phone number.';
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

export function formatRespondentName(name: string): string {
  return name.trim();
}
