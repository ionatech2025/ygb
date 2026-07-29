export const MIN_NARRATIVE_LENGTH = 10;

/** Programme target brackets (18–35 focus) for PDM collector forms — Jul 2026 client change. */
export const AGE_GROUP_VALUES = [
  'AGE_18_24',
  'AGE_25_29',
  'AGE_30_35',
  'AGE_ABOVE_35',
] as const;

export type AgeGroup = (typeof AGE_GROUP_VALUES)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  AGE_18_24: '18-24',
  AGE_25_29: '25-29',
  AGE_30_35: '30-35',
  AGE_ABOVE_35: 'Above 35',
};

/** Pre–Jul 2026 codes still returned by dashboards until backend migration completes. */
const LEGACY_AGE_GROUP_LABELS: Record<string, string> = {
  AGE_15_19: '15-19',
  AGE_20_24: '20-24',
  AGE_30_AND_ABOVE: '30+',
};

export function formatAgeGroupLabel(value: string): string {
  return AGE_GROUP_LABELS[value as AgeGroup] ?? LEGACY_AGE_GROUP_LABELS[value] ?? value;
}

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

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]['value'];
