export const MIN_AGE = 15;
export const MIN_NARRATIVE_LENGTH = 10;

export const AGE_GROUP_VALUES = [
  'AGE_15_19',
  'AGE_20_24',
  'AGE_25_29',
  'AGE_30_AND_ABOVE',
] as const;

export type AgeGroup = (typeof AGE_GROUP_VALUES)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  AGE_15_19: '15-19',
  AGE_20_24: '20-24',
  AGE_25_29: '25-29',
  AGE_30_AND_ABOVE: '30+',
};

export const RATING_VALUES = [
  'VERY_GOOD',
  'GOOD',
  'FAIR',
  'POOR',
  'VERY_POOR',
] as const;

export type Rating = (typeof RATING_VALUES)[number];

export const RATING_LABELS: Record<Rating, string> = {
  VERY_GOOD: 'Very Good',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  VERY_POOR: 'Very Poor',
};

export const MULTI_SELECT_OTHER_VALUE = 'OTHERS_SPECIFY';
