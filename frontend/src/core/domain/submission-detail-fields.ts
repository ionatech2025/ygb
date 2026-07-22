import type { SubmissionPayload, DetailFieldRow, DetailFieldSection } from '../domain/submission-admin.model';
import { FORM_TYPE_OPTIONS } from './form-type.model';
import { GENDER_OPTIONS } from './form-validation.model';
import { formatFinancialYearPeriodLabel } from '../financial-year-period';
import type { FinancialYearPeriodHalf } from './financial-year-period.model';

const FORM_TYPE_LABELS = Object.fromEntries(
  FORM_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

const GENDER_LABELS = Object.fromEntries(
  GENDER_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

const COMMON_FIELD_LABELS: Record<string, string> = {
  formType: 'Form type',
  deviceSubmissionId: 'Device submission ID',
  formCompletedAt: 'Form completed at',
  districtId: 'District ID',
  subcountyId: 'Sub-county / division ID',
  parishId: 'Parish / ward ID',
  villageId: 'Village / zone ID',
  respondentName: 'Respondent name',
  respondentPhone: 'Respondent phone',
  respondentGender: 'Gender',
  respondentAgeGroup: 'Age group',
};

const HIDDEN_PAYLOAD_KEYS = new Set(['formType']);

function humanizeFieldKey(key: string): string {
  return (
    COMMON_FIELD_LABELS[key] ??
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase())
      .trim()
  );
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '—';
    }
    if (typeof value[0] === 'object' && value[0] !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value.join(', ');
  }
  if (key === 'formType' && typeof value === 'string') {
    return FORM_TYPE_LABELS[value] ?? value;
  }
  if (key === 'respondentGender' && typeof value === 'string') {
    return GENDER_LABELS[value] ?? value;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function payloadRows(payload: SubmissionPayload, keys: string[]): DetailFieldRow[] {
  return keys
    .filter((key) => key in payload)
    .map((key) => ({
      label: humanizeFieldKey(key),
      value: formatFieldValue(key, payload[key]),
    }));
}

const FORM_SPECIFIC_KEYS: Record<string, string[]> = {
  BYP: [
    'exactAge',
    'fundReceiptDuration',
    'fundReceiptDurationSpecify',
    'receivedActualAmountRequested',
    'cashAmountReceived',
    'instalmentPeriod',
    'instalmentPeriodSpecify',
    'serviceRating',
    'performanceRating',
    'groupOrganizedTransparently',
    'receivedBds',
    'bdsServices',
    'improvementSuggestion',
  ],
  IYP: [
    'awareOfPdm',
    'eligibleCriteriaAware',
    'appliedForFund',
    'accessedFund',
    'rejectionNarrative',
    'reasonsForNotApplying',
    'informationChannels',
    'difficultiesFaced',
    'limitationExplanation',
    'improvementSuggestion',
  ],
  LGO: [
    'fiscalYearRecords',
    'fundsAllocatedEquitably',
    'allocatedFundsSufficient',
    'adequateUtilisationOversight',
    'transparentBeneficiarySelection',
    'fundsSpentAsRequired',
    'fundsSpentExplanation',
    'economicTransformation',
    'economicTransformationExplanation',
    'improvementSuggestion',
  ],
  PC: [
    'amountExpected',
    'amountReceived',
    'totalBeneficiaries',
    'youthBeneficiaries',
    'youngWomenBeneficiaries',
    'obstaclesDescription',
    'spendingTargetedToMostInNeed',
    'pdcTotalMembers',
    'pdcYouthMembers',
    'pdcWomenMembers',
    'pdcTrainingReceived',
    'pdcTrainingAreas',
    'pdcEffectivenessRating',
    'monitoredBy',
    'monitoredByOthersSpecify',
    'monitoringMethod',
    'reportSharedWithRespondent',
    'improvementsSeen',
    'improvementsSeenExplanation',
    'progressReportsSubmitted',
    'progressReportsSubmittedExplanation',
    'selfRelianceBeneficiariesCount',
    'selfRelianceGroupProjectsCount',
  ],
};

const RESPONDENT_KEYS = [
  'respondentName',
  'respondentPhone',
  'respondentGender',
  'respondentAgeGroup',
];

const LOCATION_KEYS = ['districtId', 'subcountyId', 'parishId', 'villageId'];

export function buildSubmissionDetailSections(payload: SubmissionPayload): DetailFieldSection[] {
  const formType = payload.formType;
  const formKeys = FORM_SPECIFIC_KEYS[formType] ?? Object.keys(payload).filter(
    (key) => !HIDDEN_PAYLOAD_KEYS.has(key) && !RESPONDENT_KEYS.includes(key) && !LOCATION_KEYS.includes(key) && key !== 'deviceSubmissionId' && key !== 'formCompletedAt'
  );

  return [
    { title: 'Respondent', rows: payloadRows(payload, RESPONDENT_KEYS) },
    { title: 'Location', rows: payloadRows(payload, LOCATION_KEYS) },
    {
      title: FORM_TYPE_LABELS[formType] ?? `${formType} responses`,
      rows: payloadRows(payload, formKeys),
    },
  ].filter((section) => section.rows.length > 0);
}

export function formatAdminTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString('en-UG');
}

export function formatFinancialYearPeriodKey(key: string): string {
  const match = key.match(/^(JAN_JUN|JUL_DEC)_(\d+)$/);
  if (!match) {
    return key;
  }
  return formatFinancialYearPeriodLabel({
    period: match[1] as FinancialYearPeriodHalf,
    year: Number(match[2]),
  });
}

export function formatFormTypeLabel(formType: string): string {
  return FORM_TYPE_LABELS[formType] ?? formType;
}

export function formatSubmissionStatus(status: string): string {
  return status.replace(/_/g, ' ');
}
