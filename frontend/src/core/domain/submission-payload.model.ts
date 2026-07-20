import type { AgeGroup, Rating } from './form-validation.model';
import type { FormType } from './form-type.model';
import type { RespondentFields, SubmissionProvenance } from './respondent-fields.model';

export type { RespondentFields, SubmissionProvenance, AuthProvenanceSnapshot } from './respondent-fields.model';

/** Shared respondent + provenance fields on every submission payload. */
export interface SubmissionPayloadBase extends RespondentFields, SubmissionProvenance {
  formType: FormType;
  respondentAgeGroup: AgeGroup;
}

export interface FiscalYearRecordPayload {
  fiscalYearLabel: string;
  expectedFunds: number;
  actualFunds: number;
  totalBeneficiaryCount: number;
  youngPeopleCount: number;
  youngWomenCount: number;
  totalParishesCount: number;
  fundedParishesCount: number;
}

export interface BypSubmissionPayload extends SubmissionPayloadBase {
  formType: 'BYP';
  exactAge: number;
  fundReceiptDuration: string;
  fundReceiptDurationSpecify?: string | null;
  receivedActualAmountRequested: boolean;
  cashAmountReceived?: number | null;
  instalmentPeriod: string;
  instalmentPeriodSpecify?: string | null;
  serviceRating: Rating;
  performanceRating: Rating;
  groupOrganizedTransparently: boolean;
  receivedBds: boolean;
  bdsServices?: string[] | null;
  improvementSuggestion?: string | null;
}

export interface IypSubmissionPayload extends SubmissionPayloadBase {
  formType: 'IYP';
  awareOfPdm: boolean;
  eligibleCriteriaAware?: boolean | null;
  appliedForFund?: boolean | null;
  accessedFund?: boolean | null;
  rejectionNarrative?: string | null;
  reasonsForNotApplying?: string[] | null;
  informationChannels?: string[] | null;
  difficultiesFaced?: string[] | null;
  limitationExplanation?: string | null;
  improvementSuggestion?: string | null;
}

export interface LgoSubmissionPayload extends SubmissionPayloadBase {
  formType: 'LGO';
  fiscalYearRecords: FiscalYearRecordPayload[];
  fundsSpentAsRequired: boolean;
  fundsSpentExplanation?: string | null;
  economicTransformation: boolean;
  economicTransformationExplanation?: string | null;
  improvementSuggestion?: string | null;
}

export interface PcSubmissionPayload extends SubmissionPayloadBase {
  formType: 'PC';
  amountExpected: number;
  amountReceived: number;
  totalBeneficiaries: number;
  youthBeneficiaries: number;
  youngWomenBeneficiaries: number;
  obstaclesDescription: string;
  spendingTargetedToMostInNeed: boolean;
  pdcTotalMembers: number;
  pdcYouthMembers: number;
  pdcWomenMembers: number;
  pdcTrainingReceived: boolean;
  pdcTrainingAreas?: string[] | null;
  pdcEffectivenessRating: string;
  monitoredBy: string[];
  monitoredByOthersSpecify?: string | null;
  monitoringMethod: string;
  reportSharedWithRespondent: boolean;
  improvementsSeen: boolean;
  improvementsSeenExplanation?: string | null;
  progressReportsSubmitted: boolean;
  progressReportsSubmittedExplanation?: string | null;
  selfRelianceBeneficiariesCount: number;
  selfRelianceGroupProjectsCount: number;
}

export type SubmissionPayload =
  | BypSubmissionPayload
  | IypSubmissionPayload
  | LgoSubmissionPayload
  | PcSubmissionPayload;
