import {
  requiresImprovementsSeenExplanation,
  requiresMonitoredByOthersSpecify,
  requiresPdcTrainingAreas,
  requiresProgressReportsExplanation,
  type PcFormFields,
} from './domain/pc-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup } from './domain/form-validation.model';
import { parseFundAmount, parseNonNegativeInteger } from './lgo-validation';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateNarrativeText, validatePhone, validateRequired } from './form-validation';

export type PcFormErrors = Record<string, string>;

export interface PcFormState {
  respondent: RespondentFields;
  pc: PcFormFields;
}

function validateRespondent(respondent: RespondentFields, errors: PcFormErrors): void {
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

function validateNumericField(value: string, errorKey: string, errors: PcFormErrors, message: string): void {
  if (parseFundAmount(value) == null) {
    errors[errorKey] = message;
  }
}

function validateCountField(value: string, errorKey: string, errors: PcFormErrors): void {
  if (parseNonNegativeInteger(value) == null) {
    errors[errorKey] = 'Enter a valid whole number (0 or greater).';
  }
}

export function validatePcForm(state: PcFormState): PcFormErrors {
  const errors: PcFormErrors = {};
  const { respondent, pc } = state;

  validateRespondent(respondent, errors);

  validateNumericField(pc.amountExpected, 'amountExpected', errors, 'Enter a valid numeric amount.');
  validateNumericField(pc.amountReceived, 'amountReceived', errors, 'Enter a valid numeric amount.');
  validateCountField(pc.totalBeneficiaries, 'totalBeneficiaries', errors);
  validateCountField(pc.youthBeneficiaries, 'youthBeneficiaries', errors);
  validateCountField(pc.youngWomenBeneficiaries, 'youngWomenBeneficiaries', errors);

  const obstacles = validateNarrativeText(pc.obstaclesDescription, { required: true });
  if (!obstacles.valid) {
    errors.obstaclesDescription = obstacles.message ?? 'Please describe obstacles (min 10 characters).';
  }

  if (pc.spendingTargetedToMostInNeed == null) {
    errors.spendingTargetedToMostInNeed = 'Please indicate if spending was targeted to those most in need.';
  }

  validateCountField(pc.pdcTotalMembers, 'pdcTotalMembers', errors);
  validateCountField(pc.pdcYouthMembers, 'pdcYouthMembers', errors);
  validateCountField(pc.pdcWomenMembers, 'pdcWomenMembers', errors);

  if (pc.pdcTrainingReceived == null) {
    errors.pdcTrainingReceived = 'Please indicate if the PDC received training.';
  }
  if (requiresPdcTrainingAreas(pc.pdcTrainingReceived) && pc.pdcTrainingAreas.length === 0) {
    errors.pdcTrainingAreas = 'Select at least one training area.';
  }

  if (!pc.pdcEffectivenessRating) {
    errors.pdcEffectivenessRating = 'PDC effectiveness rating is required.';
  }

  if (pc.monitoredBy.length === 0) {
    errors.monitoredBy = 'Select at least one monitoring actor.';
  }
  if (requiresMonitoredByOthersSpecify(pc.monitoredBy)) {
    const specify = validateRequired(pc.monitoredByOthersSpecify);
    if (!specify.valid) {
      errors.monitoredByOthersSpecify = 'Please specify who monitored the programme.';
    }
  }

  const monitoringMethod = validateNarrativeText(pc.monitoringMethod, { required: true });
  if (!monitoringMethod.valid) {
    errors.monitoringMethod = monitoringMethod.message ?? 'Please describe the monitoring method (min 10 characters).';
  }

  if (pc.reportSharedWithRespondent == null) {
    errors.reportSharedWithRespondent = 'Please indicate if the report was shared with the respondent.';
  }

  if (pc.improvementsSeen == null) {
    errors.improvementsSeen = 'Please indicate if improvements were seen.';
  }
  if (requiresImprovementsSeenExplanation(pc.improvementsSeen)) {
    const explanation = validateNarrativeText(pc.improvementsSeenExplanation, { required: true });
    if (!explanation.valid) {
      errors.improvementsSeenExplanation = explanation.message ?? 'Please explain in what areas (min 10 characters).';
    }
  }

  if (pc.progressReportsSubmitted == null) {
    errors.progressReportsSubmitted = 'Please indicate if progress reports were submitted.';
  }
  if (requiresProgressReportsExplanation(pc.progressReportsSubmitted)) {
    const explanation = validateNarrativeText(pc.progressReportsSubmittedExplanation, { required: true });
    if (!explanation.valid) {
      errors.progressReportsSubmittedExplanation =
        explanation.message ?? 'Please explain to whom and when (min 10 characters).';
    }
  }

  validateCountField(pc.selfRelianceBeneficiariesCount, 'selfRelianceBeneficiariesCount', errors);
  validateCountField(pc.selfRelianceGroupProjectsCount, 'selfRelianceGroupProjectsCount', errors);

  return errors;
}

export function buildPcSubmissionPayload(
  state: PcFormState,
  provenance: { deviceSubmissionId: string; formCompletedAt: string; collectorId: string }
) {
  const { respondent, pc } = state;

  return {
    formType: 'PC' as const,
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
    amountExpected: parseFundAmount(pc.amountExpected) ?? 0,
    amountReceived: parseFundAmount(pc.amountReceived) ?? 0,
    totalBeneficiaries: parseNonNegativeInteger(pc.totalBeneficiaries) ?? 0,
    youthBeneficiaries: parseNonNegativeInteger(pc.youthBeneficiaries) ?? 0,
    youngWomenBeneficiaries: parseNonNegativeInteger(pc.youngWomenBeneficiaries) ?? 0,
    obstaclesDescription: pc.obstaclesDescription.trim(),
    spendingTargetedToMostInNeed: pc.spendingTargetedToMostInNeed as boolean,
    pdcTotalMembers: parseNonNegativeInteger(pc.pdcTotalMembers) ?? 0,
    pdcYouthMembers: parseNonNegativeInteger(pc.pdcYouthMembers) ?? 0,
    pdcWomenMembers: parseNonNegativeInteger(pc.pdcWomenMembers) ?? 0,
    pdcTrainingReceived: pc.pdcTrainingReceived as boolean,
    pdcTrainingAreas: requiresPdcTrainingAreas(pc.pdcTrainingReceived) ? pc.pdcTrainingAreas : null,
    pdcEffectivenessRating: pc.pdcEffectivenessRating,
    monitoredBy: pc.monitoredBy,
    monitoredByOthersSpecify: requiresMonitoredByOthersSpecify(pc.monitoredBy)
      ? pc.monitoredByOthersSpecify.trim()
      : null,
    monitoringMethod: pc.monitoringMethod.trim(),
    reportSharedWithRespondent: pc.reportSharedWithRespondent as boolean,
    improvementsSeen: pc.improvementsSeen as boolean,
    improvementsSeenExplanation: requiresImprovementsSeenExplanation(pc.improvementsSeen)
      ? pc.improvementsSeenExplanation.trim()
      : null,
    progressReportsSubmitted: pc.progressReportsSubmitted as boolean,
    progressReportsSubmittedExplanation: requiresProgressReportsExplanation(pc.progressReportsSubmitted)
      ? pc.progressReportsSubmittedExplanation.trim()
      : null,
    selfRelianceBeneficiariesCount: parseNonNegativeInteger(pc.selfRelianceBeneficiariesCount) ?? 0,
    selfRelianceGroupProjectsCount: parseNonNegativeInteger(pc.selfRelianceGroupProjectsCount) ?? 0,
  };
}
