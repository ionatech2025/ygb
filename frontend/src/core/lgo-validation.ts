import {
  requiresEconomicTransformationExplanation,
  requiresFundsSpentExplanation,
  type FiscalYearRecordFields,
  type LgoFormFields,
} from './domain/lgo-form.model';
import type { RespondentFields } from './domain/respondent-fields.model';
import type { AgeGroup } from './domain/form-validation.model';
import type { FiscalYearRecordPayload } from './domain/submission-payload.model';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';
import { validateNarrativeText } from './form-validation';
import { formatRespondentName, validateRespondentDemographics } from './respondent-validation';

export type LgoFormErrors = Record<string, string>;

export interface LgoFormState {
  respondent: RespondentFields;
  lgo: LgoFormFields;
}

function validateRespondent(respondent: RespondentFields, errors: LgoFormErrors): void {
  validateRespondentDemographics(respondent, errors);
}

export function parseNonNegativeInteger(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parseFundAmount(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function validateFiscalYearRecord(record: FiscalYearRecordFields, errors: LgoFormErrors): void {
  const prefix = record.fiscalYearLabel.replace('/', '-');

  const expected = parseFundAmount(record.expectedFunds);
  if (expected == null) {
    errors[`expectedFunds-${prefix}`] = 'Enter a valid numeric amount.';
  }

  const actual = parseFundAmount(record.actualFunds);
  if (actual == null) {
    errors[`actualFunds-${prefix}`] = 'Enter a valid numeric amount.';
  }

  const countFields: Array<{ key: keyof FiscalYearRecordFields; errorKey: string }> = [
    { key: 'totalBeneficiaryCount', errorKey: `totalBeneficiaryCount-${prefix}` },
    { key: 'beneficiariesUnder30Count', errorKey: `beneficiariesUnder30Count-${prefix}` },
    { key: 'beneficiaryYoungWomenCount', errorKey: `beneficiaryYoungWomenCount-${prefix}` },
    { key: 'beneficiaryYoungMenCount', errorKey: `beneficiaryYoungMenCount-${prefix}` },
    { key: 'totalParishesCount', errorKey: `totalParishesCount-${prefix}` },
    { key: 'fundedParishesCount', errorKey: `fundedParishesCount-${prefix}` },
  ];

  const parsedCounts: Partial<Record<keyof FiscalYearRecordFields, number>> = {};

  for (const { key, errorKey } of countFields) {
    const parsed = parseNonNegativeInteger(record[key] as string);
    if (parsed == null) {
      errors[errorKey] = 'Enter a valid whole number (0 or greater).';
    } else {
      parsedCounts[key] = parsed;
    }
  }

  const fundedParishes = parsedCounts.fundedParishesCount;
  const totalParishes = parsedCounts.totalParishesCount;
  if (
    fundedParishes != null &&
    totalParishes != null &&
    fundedParishes > totalParishes
  ) {
    errors[`fundedParishesCount-${prefix}`] =
      'Parishes that received PDM funds cannot exceed total parishes in the district.';
  }

  const beneficiariesUnder30 = parsedCounts.beneficiariesUnder30Count;
  const youngWomen = parsedCounts.beneficiaryYoungWomenCount;
  const youngMen = parsedCounts.beneficiaryYoungMenCount;
  if (
    beneficiariesUnder30 != null &&
    youngWomen != null &&
    youngMen != null &&
    youngWomen + youngMen > beneficiariesUnder30
  ) {
    errors[`beneficiaryYoungMenCount-${prefix}`] =
      'Young women and young men beneficiaries cannot exceed beneficiaries under 30.';
  }
}

export function validateLgoForm(state: LgoFormState): LgoFormErrors {
  const errors: LgoFormErrors = {};
  const { respondent, lgo } = state;

  validateRespondent(respondent, errors);

  if (!lgo.reportingFiscalYearLabel) {
    errors.reportingFiscalYearLabel = 'Active fiscal year is not available. Contact your administrator.';
  } else {
    validateFiscalYearRecord(lgo.currentFiscalYearRecord, errors);
    if (lgo.priorFiscalYearLabel && lgo.priorFiscalYearRecord) {
      validateFiscalYearRecord(lgo.priorFiscalYearRecord, errors);
    }
  }

  if (lgo.fundsAllocatedEquitably == null) {
    errors.fundsAllocatedEquitably = 'Please answer the equitable allocation question.';
  }
  if (lgo.allocatedFundsSufficient == null) {
    errors.allocatedFundsSufficient = 'Please answer the fund sufficiency question.';
  }
  if (lgo.adequateUtilisationOversight == null) {
    errors.adequateUtilisationOversight = 'Please answer the oversight question.';
  }
  if (lgo.transparentBeneficiarySelection == null) {
    errors.transparentBeneficiarySelection = 'Please answer the beneficiary selection question.';
  }

  if (lgo.fundsSpentAsRequired == null) {
    errors.fundsSpentAsRequired = 'Please indicate if funds were spent as required.';
  }
  if (requiresFundsSpentExplanation(lgo.fundsSpentAsRequired)) {
    const explanation = validateNarrativeText(lgo.fundsSpentExplanation, { required: true });
    if (!explanation.valid) {
      errors.fundsSpentExplanation = explanation.message ?? 'Please explain (min 10 characters).';
    }
  }

  if (lgo.economicTransformation == null) {
    errors.economicTransformation = 'Please answer the economic transformation question.';
  }
  if (requiresEconomicTransformationExplanation(lgo.economicTransformation)) {
    const explanation = validateNarrativeText(lgo.economicTransformationExplanation, { required: true });
    if (!explanation.valid) {
      errors.economicTransformationExplanation =
        explanation.message ?? 'Please explain (min 10 characters).';
    }
  }

  const improvement = validateNarrativeText(lgo.improvementSuggestion, { required: true });
  if (!improvement.valid) {
    errors.improvementSuggestion = improvement.message ?? 'Improvement suggestion is required (min 10 characters).';
  }

  return errors;
}

function toFiscalYearPayload(record: FiscalYearRecordFields): FiscalYearRecordPayload {
  return {
    fiscalYearLabel: record.fiscalYearLabel,
    expectedFunds: parseFundAmount(record.expectedFunds) ?? 0,
    actualFunds: parseFundAmount(record.actualFunds) ?? 0,
    totalBeneficiaryCount: parseNonNegativeInteger(record.totalBeneficiaryCount) ?? 0,
    beneficiariesUnder30Count: parseNonNegativeInteger(record.beneficiariesUnder30Count) ?? 0,
    beneficiaryYoungWomenCount: parseNonNegativeInteger(record.beneficiaryYoungWomenCount) ?? 0,
    beneficiaryYoungMenCount: parseNonNegativeInteger(record.beneficiaryYoungMenCount) ?? 0,
    totalParishesCount: parseNonNegativeInteger(record.totalParishesCount) ?? 0,
    fundedParishesCount: parseNonNegativeInteger(record.fundedParishesCount) ?? 0,
  };
}

export function buildLgoSubmissionPayload(
  state: LgoFormState,
  provenance: { deviceSubmissionId: string; formCompletedAt: string; collectorId: string }
) {
  const { respondent, lgo } = state;

  const fiscalYearRecords: FiscalYearRecordPayload[] = [
    toFiscalYearPayload(lgo.currentFiscalYearRecord),
  ];
  if (lgo.priorFiscalYearLabel && lgo.priorFiscalYearRecord) {
    fiscalYearRecords.push(toFiscalYearPayload(lgo.priorFiscalYearRecord));
  }

  return {
    formType: 'LGO' as const,
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
    fiscalYearRecords,
    fundsAllocatedEquitably: lgo.fundsAllocatedEquitably as boolean,
    allocatedFundsSufficient: lgo.allocatedFundsSufficient as boolean,
    adequateUtilisationOversight: lgo.adequateUtilisationOversight as boolean,
    transparentBeneficiarySelection: lgo.transparentBeneficiarySelection as boolean,
    fundsSpentAsRequired: lgo.fundsSpentAsRequired as boolean,
    fundsSpentExplanation: requiresFundsSpentExplanation(lgo.fundsSpentAsRequired)
      ? lgo.fundsSpentExplanation.trim()
      : null,
    economicTransformation: lgo.economicTransformation as boolean,
    economicTransformationExplanation: requiresEconomicTransformationExplanation(lgo.economicTransformation)
      ? lgo.economicTransformationExplanation.trim()
      : null,
    improvementSuggestion: lgo.improvementSuggestion.trim(),
  };
}
