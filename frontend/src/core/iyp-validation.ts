import {
  requiresAccessedFund,
  requiresEligibleCriteriaAware,
  requiresInformationChannels,
  requiresLimitationExplanation,
  requiresReasonsForNotApplying,
  requiresRejectionNarrative,
  type IypFormFields,
} from './domain/iyp-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup } from './domain/form-validation.model';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateNarrativeText, validatePhone, validateRequired } from './form-validation';

export type IypFormErrors = Record<string, string>;

export interface IypFormState {
  respondent: RespondentFields;
  iyp: IypFormFields;
}

function validateRespondent(respondent: RespondentFields, errors: IypFormErrors): void {
  if (!validateRequired(respondent.respondentName).valid) {
    errors.respondentName = 'Name of respondent is required.';
  }
  if (!validatePhone(respondent.respondentPhone).valid) {
    errors.respondentPhone = validatePhone(respondent.respondentPhone).message ?? 'Invalid phone number.';
  }
  if (!respondent.respondentGender) errors.respondentGender = 'Gender is required.';
  if (!respondent.respondentAgeGroup) errors.respondentAgeGroup = 'Age group is required.';
  if (!respondent.districtId) errors.districtId = 'District is required.';
  if (!respondent.subcountyId) errors.subcountyId = 'Sub-county is required.';
  if (!respondent.parishId) errors.parishId = 'Parish is required.';
  if (!respondent.villageId) errors.villageId = 'Village is required.';
}

export function validateIypForm(state: IypFormState): IypFormErrors {
  const errors: IypFormErrors = {};
  const { respondent, iyp } = state;

  validateRespondent(respondent, errors);

  if (iyp.awareOfPdm == null) {
    errors.awareOfPdm = 'Please indicate if the respondent is aware of PDM.';
  }

  if (requiresInformationChannels(iyp.awareOfPdm)) {
    if (iyp.informationChannels.length === 0) {
      errors.informationChannels = 'Select at least one information channel.';
    }
    if (requiresEligibleCriteriaAware(iyp.awareOfPdm) && iyp.eligibleCriteriaAware == null) {
      errors.eligibleCriteriaAware = 'Please answer the eligibility criteria question.';
    }
    if (iyp.appliedForFund == null) {
      errors.appliedForFund = 'Please indicate if the respondent applied for the fund.';
    }
    if (requiresAccessedFund(iyp.appliedForFund) && iyp.accessedFund == null) {
      errors.accessedFund = 'Please indicate if the fund was accessed after applying.';
    }
    if (requiresRejectionNarrative(iyp.appliedForFund, iyp.accessedFund)) {
      const narrative = validateNarrativeText(iyp.rejectionNarrative, { required: true });
      if (!narrative.valid) {
        errors.rejectionNarrative = narrative.message ?? 'Rejection narrative is required (min 10 characters).';
      }
    }
    if (requiresReasonsForNotApplying(iyp.appliedForFund) && iyp.reasonsForNotApplying.length === 0) {
      errors.reasonsForNotApplying = 'Select at least one reason for not applying.';
    }
  }

  if (requiresLimitationExplanation(iyp.difficultiesFaced)) {
    const spec = validateNarrativeText(iyp.limitationExplanation, { required: true });
    if (!spec.valid) {
      errors.limitationExplanation = spec.message ?? 'Please explain the limitation (min 10 characters).';
    }
  }

  const improvement = validateNarrativeText(iyp.improvementSuggestion, { required: true });
  if (!improvement.valid) {
    errors.improvementSuggestion = improvement.message ?? 'Improvement suggestion is required (min 10 characters).';
  }

  return errors;
}

export function buildIypSubmissionPayload(
  state: IypFormState,
  provenance: { deviceSubmissionId: string; formCompletedAt: string; collectorId: string }
) {
  const { respondent, iyp } = state;
  const aware = iyp.awareOfPdm === true;

  return {
    formType: 'IYP' as const,
    deviceSubmissionId: provenance.deviceSubmissionId,
    formCompletedAt: provenance.formCompletedAt,
    districtId: respondent.districtId,
    subcountyId: respondent.subcountyId,
    parishId: respondent.parishId,
    villageId: respondent.villageId,
    respondentName: respondent.respondentName.trim(),
    respondentPhone: normalizeUgandaPhoneLocal(respondent.respondentPhone),
    respondentGender: respondent.respondentGender,
    respondentAgeGroup: respondent.respondentAgeGroup as AgeGroup,
    awareOfPdm: iyp.awareOfPdm as boolean,
    eligibleCriteriaAware: aware ? iyp.eligibleCriteriaAware : null,
    appliedForFund: aware ? iyp.appliedForFund : null,
    accessedFund: aware && iyp.appliedForFund === true ? iyp.accessedFund : null,
    rejectionNarrative:
      aware && requiresRejectionNarrative(iyp.appliedForFund, iyp.accessedFund)
        ? iyp.rejectionNarrative.trim()
        : null,
    reasonsForNotApplying:
      aware && requiresReasonsForNotApplying(iyp.appliedForFund) ? iyp.reasonsForNotApplying : null,
    informationChannels: aware ? iyp.informationChannels : null,
    difficultiesFaced: iyp.difficultiesFaced.length > 0 ? iyp.difficultiesFaced : null,
    limitationExplanation: requiresLimitationExplanation(iyp.difficultiesFaced)
      ? iyp.limitationExplanation.trim()
      : null,
    improvementSuggestion: iyp.improvementSuggestion.trim(),
  };
}
