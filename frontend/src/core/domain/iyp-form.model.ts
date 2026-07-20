export const INFORMATION_CHANNEL_OPTIONS = [
  { value: 'RADIO', label: 'Radio' },
  { value: 'TELEVISION', label: 'Television' },
  { value: 'RELATIVES_FRIENDS', label: 'Relatives / Friends' },
  { value: 'SOCIAL_MEDIA', label: 'Social media' },
  { value: 'COMMUNITY_MEETINGS', label: 'Community meetings' },
  { value: 'OTHERS', label: 'Others (specify)' },
] as const;

export const REASONS_FOR_NOT_APPLYING_OPTIONS = [
  { value: 'NOT_ELIGIBLE', label: 'Not eligible' },
  { value: 'LACK_OF_INFORMATION', label: 'Lack of information' },
  { value: 'COMPLEX_APPLICATION', label: 'Application process too complex' },
  { value: 'NO_INTEREST', label: 'No interest' },
  { value: 'OTHERS', label: 'Others (specify)' },
] as const;

export const DIFFICULTIES_FACED_OPTIONS = [
  { value: 'LIMITATION_IN_AMOUNT', label: 'Limitation in the amount applied for (low or high, explain)' },
  { value: 'LACK_OF_INFORMATION', label: 'Lack of information' },
  { value: 'LONG_PROCESSING_TIME', label: 'Long processing time' },
  { value: 'INACCESSIBLE_OFFICES', label: 'Inaccessible offices' },
  { value: 'OTHERS', label: 'Others (specify)' },
] as const;

export type InformationChannel = (typeof INFORMATION_CHANNEL_OPTIONS)[number]['value'];
export type ReasonForNotApplying = (typeof REASONS_FOR_NOT_APPLYING_OPTIONS)[number]['value'];
export type DifficultyFaced = (typeof DIFFICULTIES_FACED_OPTIONS)[number]['value'];

export interface IypFormFields {
  awareOfPdm: boolean | null;
  informationChannels: InformationChannel[];
  eligibleCriteriaAware: boolean | null;
  appliedForFund: boolean | null;
  accessedFund: boolean | null;
  rejectionNarrative: string;
  reasonsForNotApplying: ReasonForNotApplying[];
  difficultiesFaced: DifficultyFaced[];
  limitationExplanation: string;
  improvementSuggestion: string;
}

export const EMPTY_IYP_FIELDS: IypFormFields = {
  awareOfPdm: null,
  informationChannels: [],
  eligibleCriteriaAware: null,
  appliedForFund: null,
  accessedFund: null,
  rejectionNarrative: '',
  reasonsForNotApplying: [],
  difficultiesFaced: [],
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
