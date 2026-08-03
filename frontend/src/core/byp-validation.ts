import {
  encodeBdsServices,
  requiresBdsOthersSpecify,
  requiresFundDurationSpecify,
  requiresLoanRepaymentDuration,
  type BypFormFields,
} from './domain/byp-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup, Rating } from './domain/form-validation.model';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateDurationText, validateNarrativeText, validateRequired } from './form-validation';
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
    const spec = validateDurationText(byp.fundReceiptDurationSpecify, { required: true });
    if (!spec.valid) errors.fundReceiptDurationSpecify = spec.message ?? 'Please specify (min 5 characters).';
  }

  if (byp.receivedActualAmountRequested == null) {
    errors.receivedActualAmountRequested = 'Please indicate if the actual amount was received.';
  }

  const cash = typeof byp.cashAmountReceived === 'number' ? byp.cashAmountReceived : NaN;
  if (!Number.isFinite(cash) || cash < 0) {
    errors.cashAmountReceived = 'Enter a valid cash amount received.';
  }

  const waitAfterApplied = validateDurationText(byp.fundsReceiptWaitAfterApplied, { required: true });
  if (!waitAfterApplied.valid) {
    errors.fundsReceiptWaitAfterApplied =
      waitAfterApplied.message ?? 'Please describe how long it took (min 5 characters).';
  }

  const moneyUsedFor = validateNarrativeText(byp.moneyUsedFor, { required: true });
  if (!moneyUsedFor.valid) {
    errors.moneyUsedFor = moneyUsedFor.message ?? 'Please describe what the money was used for (min 10 characters).';
  }

  if (!byp.serviceRating) errors.serviceRating = 'Service rating is required.';

  if (byp.loanRepaid == null) {
    errors.loanRepaid = 'Please indicate if you have repaid the loan.';
  }
  if (requiresLoanRepaymentDuration(byp.loanRepaid) && !byp.loanRepaymentDuration) {
    errors.loanRepaymentDuration = 'Select how long it took to repay the loan.';
  }

  if (!byp.performanceRating) errors.performanceRating = 'Performance rating is required.';
  if (byp.groupOrganizedTransparently == null) {
    errors.groupOrganizedTransparently = 'Please answer the transparency question.';
  }
  if (byp.receivedBds == null) errors.receivedBds = 'Please indicate if BDS was received.';
  if (byp.receivedBds === true && byp.bdsServices.length === 0) {
    errors.bdsServices = 'Select at least one business development service.';
  }
  if (byp.receivedBds === true && requiresBdsOthersSpecify(byp.bdsServices)) {
    const specify = validateRequired(byp.bdsServicesOthersSpecify);
    if (!specify.valid) {
      errors.bdsServicesOthersSpecify = 'Please specify the other business development service.';
    }
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
    fundsReceiptWaitAfterApplied: byp.fundsReceiptWaitAfterApplied.trim(),
    moneyUsedFor: byp.moneyUsedFor.trim(),
    serviceRating: byp.serviceRating as Rating,
    loanRepaid: byp.loanRepaid as boolean,
    loanRepaymentDuration: requiresLoanRepaymentDuration(byp.loanRepaid)
      ? byp.loanRepaymentDuration
      : null,
    performanceRating: byp.performanceRating as Rating,
    groupOrganizedTransparently: byp.groupOrganizedTransparently as boolean,
    receivedBds: byp.receivedBds as boolean,
    bdsServices: byp.receivedBds
      ? encodeBdsServices(byp.bdsServices, byp.bdsServicesOthersSpecify)
      : null,
    improvementSuggestion: byp.improvementSuggestion.trim(),
  };
}
