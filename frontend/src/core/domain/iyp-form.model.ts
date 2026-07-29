export const IYP_OTHERS_OPTION_VALUE = 'OTHERS';

export const INFORMATION_CHANNEL_OPTIONS = [
  { value: 'RADIO', label: 'Radio' },
  { value: 'TELEVISION', label: 'Television' },
  { value: 'NEWSPAPER', label: 'Newspaper' },
  { value: 'PHONE_SMS', label: 'Phone/SMS' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media/Internet' },
  { value: 'COMMUNITY_MEETINGS', label: 'Community meetings' },
  { value: 'RELATIVES_FRIENDS', label: 'Relatives/Friends' },
  { value: 'PARISH_CHIEF_LGO', label: 'Parish Chief/Local Government officials' },
  { value: 'PDM_BOOKLET', label: 'PDM programme booklet' },
  { value: IYP_OTHERS_OPTION_VALUE, label: 'Other (specify)' },
] as const;

export const REASONS_FOR_NOT_APPLYING_OPTIONS = [
  { value: 'UNAWARE_OF_PROGRAMME', label: 'Unaware of the programme' },
  { value: 'NOT_ELIGIBLE', label: 'Does not meet the eligibility criteria' },
  { value: 'NO_INTEREST', label: 'Not interested' },
  { value: 'COMPLEX_APPLICATION', label: 'Application process too complicated' },
  { value: 'FEAR_INABILITY_TO_REPAY', label: 'Fear of inability to repay loan' },
  { value: 'LACK_OF_GROUP', label: 'Lack of group to join' },
  { value: IYP_OTHERS_OPTION_VALUE, label: 'Other (specify)' },
] as const;

export const DIFFICULTIES_FACED_OPTIONS = [
  { value: 'BENEFICIARY_CRITERIA_CUMBERSOME', label: 'Beneficiary criteria too cumbersome' },
  { value: 'TIME_CONSUMING_APPLICATION', label: 'Time-consuming application process' },
  { value: 'LENGTHY_DISBURSEMENT', label: 'Lengthy fund disbursement process' },
  { value: 'POOR_PLANNING', label: 'Poor planning and coordination' },
  { value: 'MANAGER_ABSENTEEISM', label: 'Absenteeism of PDM programme managers' },
  { value: 'AGE_DISCRIMINATION', label: 'Discrimination due to age' },
  {
    value: 'LIMITATION_IN_AMOUNT',
    label: 'Limitation in the amount applied for (low or high, explain)',
  },
  { value: 'LACK_OF_TRANSPARENCY', label: 'Lack of transparency in selection' },
  { value: IYP_OTHERS_OPTION_VALUE, label: 'Other (specify)' },
] as const;

export type InformationChannel = (typeof INFORMATION_CHANNEL_OPTIONS)[number]['value'];
export type ReasonForNotApplying = (typeof REASONS_FOR_NOT_APPLYING_OPTIONS)[number]['value'];
export type DifficultyFaced = (typeof DIFFICULTIES_FACED_OPTIONS)[number]['value'];

export interface IypFormFields {
  awareOfPdm: boolean | null;
  informationChannels: InformationChannel[];
  informationChannelsOthersSpecify: string;
  eligibleCriteriaAware: boolean | null;
  appliedForFund: boolean | null;
  accessedFund: boolean | null;
  rejectionNarrative: string;
  reasonsForNotApplying: ReasonForNotApplying[];
  reasonsForNotApplyingOthersSpecify: string;
  difficultiesFaced: DifficultyFaced[];
  difficultiesFacedOthersSpecify: string;
  limitationExplanation: string;
  improvementSuggestion: string;
}

export const EMPTY_IYP_FIELDS: IypFormFields = {
  awareOfPdm: null,
  informationChannels: [],
  informationChannelsOthersSpecify: '',
  eligibleCriteriaAware: null,
  appliedForFund: null,
  accessedFund: null,
  rejectionNarrative: '',
  reasonsForNotApplying: [],
  reasonsForNotApplyingOthersSpecify: '',
  difficultiesFaced: [],
  difficultiesFacedOthersSpecify: '',
  limitationExplanation: '',
  improvementSuggestion: '',
};

export function isAwareOfPdm(value: boolean | null): value is true {
  return value === true;
}

export function requiresEligibleCriteriaAware(awareOfPdm: boolean | null): boolean {
  return awareOfPdm === true;
}

export function requiresInformationChannels(awareOfPdm: boolean | null): boolean {
  return awareOfPdm === true;
}

export function requiresAppliedQuestions(awareOfPdm: boolean | null): boolean {
  return awareOfPdm === true;
}

export function requiresAccessedFund(appliedForFund: boolean | null): boolean {
  return appliedForFund === true;
}

export function requiresRejectionNarrative(
  appliedForFund: boolean | null,
  accessedFund: boolean | null
): boolean {
  return appliedForFund === true && accessedFund === false;
}

export function requiresReasonsForNotApplying(appliedForFund: boolean | null): boolean {
  return appliedForFund === false;
}

export function requiresLimitationExplanation(difficultiesFaced: DifficultyFaced[]): boolean {
  return difficultiesFaced.includes('LIMITATION_IN_AMOUNT');
}

export function requiresOthersSpecify(selected: readonly string[]): boolean {
  return selected.includes(IYP_OTHERS_OPTION_VALUE);
}

export function encodeOthersInSelection(selected: string[], specify: string): string[] {
  if (!requiresOthersSpecify(selected)) {
    return selected;
  }
  const trimmed = specify.trim();
  return selected.map((value) => (value === IYP_OTHERS_OPTION_VALUE ? `OTHERS:${trimmed}` : value));
}
