import {
  encodeOthersInSelection,
  requiresAccessedFund,
  requiresEligibleCriteriaAware,
  requiresInformationChannels,
  requiresLimitationExplanation,
  requiresOthersSpecify,
  requiresReasonsForNotApplying,
  requiresRejectionNarrative,
  type IypFormFields,
} from './domain/iyp-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup } from './domain/form-validation.model';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateNarrativeText, validateRequired } from './form-validation';
import { formatRespondentName, validateRespondentDemographics } from './respondent-validation';

export type IypFormErrors = Record<string, string>;

export interface IypFormState {
  respondent: RespondentFields;
  iyp: IypFormFields;
}

function validateRespondent(respondent: RespondentFields, errors: IypFormErrors): void {
  validateRespondentDemographics(respondent, errors);
}

function validateOthersSpecify(
  selected: string[],
  specify: string,
  errorKey: string,
  errors: IypFormErrors,
  message: string
): void {
  if (requiresOthersSpecify(selected)) {
    const result = validateRequired(specify);
    if (!result.valid) {
      errors[errorKey] = message;
    }
  }
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
    validateOthersSpecify(
      iyp.informationChannels,
      iyp.informationChannelsOthersSpecify,
      'informationChannelsOthersSpecify',
      errors,
      'Please specify how you got information about the PDM programme.'
    );
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
        errors.rejectionNarrative = narrative.message ?? 'Rejection explanation is required (min 10 characters).';
      }
    }
    if (requiresReasonsForNotApplying(iyp.appliedForFund) && iyp.reasonsForNotApplying.length === 0) {
      errors.reasonsForNotApplying = 'Select at least one reason for not applying.';
    }
    validateOthersSpecify(
      iyp.reasonsForNotApplying,
      iyp.reasonsForNotApplyingOthersSpecify,
      'reasonsForNotApplyingOthersSpecify',
      errors,
      'Please specify why you did not apply for the PDM fund.'
    );
  }

  validateOthersSpecify(
    iyp.difficultiesFaced,
    iyp.difficultiesFacedOthersSpecify,
    'difficultiesFacedOthersSpecify',
    errors,
    'Please specify the other difficulty faced.'
  );

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
    respondentName: formatRespondentName(respondent.respondentName),
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
      aware && requiresReasonsForNotApplying(iyp.appliedForFund)
        ? encodeOthersInSelection(iyp.reasonsForNotApplying, iyp.reasonsForNotApplyingOthersSpecify)
        : null,
    informationChannels: aware
      ? encodeOthersInSelection(iyp.informationChannels, iyp.informationChannelsOthersSpecify)
      : null,
    difficultiesFaced:
      iyp.difficultiesFaced.length > 0
        ? encodeOthersInSelection(iyp.difficultiesFaced, iyp.difficultiesFacedOthersSpecify)
        : null,
    limitationExplanation: requiresLimitationExplanation(iyp.difficultiesFaced)
      ? iyp.limitationExplanation.trim()
      : null,
    improvementSuggestion: iyp.improvementSuggestion.trim(),
  };
}
