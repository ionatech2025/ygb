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
import { validateNarrativeText, validatePhone, validateRequired } from './form-validation';

export type LgoFormErrors = Record<string, string>;

export interface LgoFormState {
  respondent: RespondentFields;
  lgo: LgoFormFields;
}

function validateRespondent(respondent: RespondentFields, errors: LgoFormErrors): void {
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

  const countFields: Array<{ key: keyof FiscalYearRecordFields; errorKey: string; label: string }> = [
    { key: 'totalBeneficiaryCount', errorKey: `totalBeneficiaryCount-${prefix}`, label: 'Total beneficiaries' },
    { key: 'youngPeopleCount', errorKey: `youngPeopleCount-${prefix}`, label: 'Young people under 30' },
    { key: 'youngWomenCount', errorKey: `youngWomenCount-${prefix}`, label: 'Young women under 30' },
    { key: 'totalParishesCount', errorKey: `totalParishesCount-${prefix}`, label: 'Total parishes' },
    { key: 'fundedParishesCount', errorKey: `fundedParishesCount-${prefix}`, label: 'Parishes that received funds' },
  ];

  for (const { key, errorKey } of countFields) {
    const parsed = parseNonNegativeInteger(record[key] as string);
    if (parsed == null) {
      errors[errorKey] = 'Enter a valid whole number (0 or greater).';
    }
  }
}

export function validateLgoForm(state: LgoFormState): LgoFormErrors {
  const errors: LgoFormErrors = {};
  const { respondent, lgo } = state;

  validateRespondent(respondent, errors);

  if (!lgo.selectedFiscalYearLabel) {
    errors.selectedFiscalYearLabel = 'Select the fiscal year you are reporting for.';
  } else {
    validateFiscalYearRecord(
      { ...lgo.fiscalYearRecord, fiscalYearLabel: lgo.selectedFiscalYearLabel },
      errors
    );
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
    youngPeopleCount: parseNonNegativeInteger(record.youngPeopleCount) ?? 0,
    youngWomenCount: parseNonNegativeInteger(record.youngWomenCount) ?? 0,
    totalParishesCount: parseNonNegativeInteger(record.totalParishesCount) ?? 0,
    fundedParishesCount: parseNonNegativeInteger(record.fundedParishesCount) ?? 0,
  };
}

export function buildLgoSubmissionPayload(
  state: LgoFormState,
  provenance: { deviceSubmissionId: string; formCompletedAt: string; collectorId: string }
) {
  const { respondent, lgo } = state;

  return {
    formType: 'LGO' as const,
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
    fiscalYearRecords: [
      toFiscalYearPayload({
        ...lgo.fiscalYearRecord,
        fiscalYearLabel: lgo.selectedFiscalYearLabel,
      }),
    ],
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
