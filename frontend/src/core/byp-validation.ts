import {
  requiresFundDurationSpecify,
  requiresInstalmentSpecify,
  type BypFormFields,
} from './domain/byp-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup, Rating } from './domain/form-validation.model';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateNarrativeText } from './form-validation';
import { formatRespondentName, validateRespondentDemographics } from './respondent-validation';

export type BypFormErrors = Record<string, string>;

export interface BypFormState {
  respondent: RespondentFields;
  byp: BypFormFields;
}

export function validateBypForm(state: BypFormState): BypFormErrors {
  const errors: BypFormErrors = {};
  const { respondent, byp } = state;

  validateRespondentDemographics(respondent, errors);

  if (!byp.fundReceiptDuration) errors.fundReceiptDuration = 'Fund receipt duration is required.';
  if (requiresFundDurationSpecify(byp.fundReceiptDuration)) {
    const spec = validateNarrativeText(byp.fundReceiptDurationSpecify, { required: true });
    if (!spec.valid) errors.fundReceiptDurationSpecify = spec.message ?? 'Please specify (min 10 characters).';
  }

  if (byp.receivedActualAmountRequested == null) {
    errors.receivedActualAmountRequested = 'Please indicate if the actual amount was received.';
  }

  const cash = typeof byp.cashAmountReceived === 'number' ? byp.cashAmountReceived : NaN;
  if (!Number.isFinite(cash) || cash < 0) {
    errors.cashAmountReceived = 'Enter a valid cash amount received.';
  }

  if (!byp.instalmentPeriod) errors.instalmentPeriod = 'Instalment period is required.';
  if (requiresInstalmentSpecify(byp.instalmentPeriod)) {
    const spec = validateNarrativeText(byp.instalmentPeriodSpecify, { required: true });
    if (!spec.valid) errors.instalmentPeriodSpecify = spec.message ?? 'Please specify (min 10 characters).';
  }

  if (!byp.serviceRating) errors.serviceRating = 'Service rating is required.';
  if (!byp.performanceRating) errors.performanceRating = 'Performance rating is required.';
  if (byp.groupOrganizedTransparently == null) {
    errors.groupOrganizedTransparently = 'Please answer the transparency question.';
  }
  if (byp.receivedBds == null) errors.receivedBds = 'Please indicate if BDS was received.';
  if (byp.receivedBds === true && byp.bdsServices.length === 0) {
    errors.bdsServices = 'Select at least one business development service.';
  }

  const narrative = validateNarrativeText(byp.improvementSuggestion, { required: true });
  if (!narrative.valid) {
    errors.improvementSuggestion = narrative.message ?? 'Improvement suggestion is required (min 10 characters).';
  }

  return errors;
}

export function buildBypSubmissionPayload(
  state: BypFormState,
  provenance: { deviceSubmissionId: string; formCompletedAt: string; collectorId: string }
) {
  const { respondent, byp } = state;

  return {
    formType: 'BYP' as const,
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
    fundReceiptDuration: byp.fundReceiptDuration,
    fundReceiptDurationSpecify: requiresFundDurationSpecify(byp.fundReceiptDuration)
      ? byp.fundReceiptDurationSpecify.trim()
      : null,
    receivedActualAmountRequested: byp.receivedActualAmountRequested as boolean,
    cashAmountReceived: Number(byp.cashAmountReceived),
    instalmentPeriod: byp.instalmentPeriod,
    instalmentPeriodSpecify: requiresInstalmentSpecify(byp.instalmentPeriod)
      ? byp.instalmentPeriodSpecify.trim()
      : null,
    serviceRating: byp.serviceRating as Rating,
    performanceRating: byp.performanceRating as Rating,
    groupOrganizedTransparently: byp.groupOrganizedTransparently as boolean,
    receivedBds: byp.receivedBds as boolean,
    bdsServices: byp.receivedBds ? byp.bdsServices : null,
    improvementSuggestion: byp.improvementSuggestion.trim(),
  };
}
