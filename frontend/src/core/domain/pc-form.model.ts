export const PDC_EFFECTIVENESS_OPTIONS = [
  { value: 'FULLY', label: 'Fully' },
  { value: 'MOSTLY', label: 'Mostly' },
  { value: 'SOME', label: 'Some' },
  { value: 'HARDLY', label: 'Hardly' },
  { value: 'NONE', label: 'None' },
] as const;

export const PDC_TRAINING_AREA_OPTIONS = [
  { value: 'FINANCIAL_LITERACY', label: 'Financial literacy' },
  { value: 'BUSINESS_PLANNING', label: 'Business planning' },
  { value: 'RECORD_KEEPING', label: 'Record keeping' },
  { value: 'LEADERSHIP', label: 'Leadership and governance' },
  { value: 'PROJECT_MANAGEMENT', label: 'Project management' },
] as const;

export const MONITORED_BY_OPTIONS = [
  { value: 'CAO', label: 'CAO' },
  { value: 'RDC', label: 'RDC' },
  { value: 'CITY_CLERK', label: 'City Clerk' },
  { value: 'SAS_TOWN_CLERK', label: 'SAS / Town Clerk' },
  { value: 'LCV_CHAIRPERSON', label: 'LCV Chairperson' },
  { value: 'LCIII_MAYOR', label: 'LCIII / Mayor' },
  { value: 'COUNCILLORS', label: 'Councillors' },
  { value: 'PDM_SECRETARIAT', label: 'PDM Secretariat' },
  { value: 'MINISTRY_OF_LOCAL_GOVERNMENT', label: 'Ministry of Local Government' },
  { value: 'OTHERS', label: 'Others (specify)' },
] as const;

export const MONITORED_BY_OTHER_VALUE = 'OTHERS';

export type PdcEffectivenessRating = (typeof PDC_EFFECTIVENESS_OPTIONS)[number]['value'];
export type PdcTrainingArea = (typeof PDC_TRAINING_AREA_OPTIONS)[number]['value'];
export type MonitoredByOption = (typeof MONITORED_BY_OPTIONS)[number]['value'];

export interface PcFormFields {
  amountExpected: string;
  amountReceived: string;
  totalBeneficiaries: string;
  youthBeneficiaries: string;
  youngWomenBeneficiaries: string;
  obstaclesDescription: string;
  spendingTargetedToMostInNeed: boolean | null;
  pdcTotalMembers: string;
  pdcYouthMembers: string;
  pdcWomenMembers: string;
  pdcTrainingReceived: boolean | null;
  pdcTrainingAreas: PdcTrainingArea[];
  pdcEffectivenessRating: string;
  monitoredBy: MonitoredByOption[];
  monitoredByOthersSpecify: string;
  monitoringMethod: string;
  reportSharedWithRespondent: boolean | null;
  improvementsSeen: boolean | null;
  improvementsSeenExplanation: string;
  progressReportsSubmitted: boolean | null;
  progressReportsSubmittedExplanation: string;
  selfRelianceBeneficiariesCount: string;
  selfRelianceGroupProjectsCount: string;
}

export const EMPTY_PC_FIELDS: PcFormFields = {
  amountExpected: '',
  amountReceived: '',
  totalBeneficiaries: '',
  youthBeneficiaries: '',
  youngWomenBeneficiaries: '',
  obstaclesDescription: '',
  spendingTargetedToMostInNeed: null,
  pdcTotalMembers: '',
  pdcYouthMembers: '',
  pdcWomenMembers: '',
  pdcTrainingReceived: null,
  pdcTrainingAreas: [],
  pdcEffectivenessRating: '',
  monitoredBy: [],
  monitoredByOthersSpecify: '',
  monitoringMethod: '',
  reportSharedWithRespondent: null,
  improvementsSeen: null,
  improvementsSeenExplanation: '',
  progressReportsSubmitted: null,
  progressReportsSubmittedExplanation: '',
  selfRelianceBeneficiariesCount: '',
  selfRelianceGroupProjectsCount: '',
};

export function requiresPdcTrainingAreas(pdcTrainingReceived: boolean | null): boolean {
  return pdcTrainingReceived === true;
}

export function requiresMonitoredByOthersSpecify(monitoredBy: MonitoredByOption[]): boolean {
  return monitoredBy.includes(MONITORED_BY_OTHER_VALUE);
}

export function requiresImprovementsSeenExplanation(improvementsSeen: boolean | null): boolean {
  return improvementsSeen === true;
}

export function requiresProgressReportsExplanation(progressReportsSubmitted: boolean | null): boolean {
  return progressReportsSubmitted === true;
}
