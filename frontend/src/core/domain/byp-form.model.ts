import type { Rating } from './form-validation.model';

export const FUND_RECEIPT_DURATION_OPTIONS = [
  { value: 'ONE_WEEK', label: 'One week' },
  { value: 'MORE_THAN_WEEK_LESS_THAN_MONTH', label: 'More than a week and less than a month' },
  { value: 'MONTH', label: 'One month' },
  { value: 'MONTHS', label: 'Months (specify)' },
] as const;

export const INSTALMENT_PERIOD_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'BIANNUALLY', label: 'Biannually' },
  { value: 'ANNUAL', label: 'Annual' },
  { value: 'OTHERS', label: 'Other (specify)' },
] as const;

export const BDS_SERVICE_OPTIONS = [
  { value: 'TRAINING', label: 'Training' },
  { value: 'MARKET_LINKAGES', label: 'Market linkages' },
  { value: 'EXTENSION_SERVICE', label: 'Extension service' },
] as const;

export type FundReceiptDuration = (typeof FUND_RECEIPT_DURATION_OPTIONS)[number]['value'];
export type InstalmentPeriod = (typeof INSTALMENT_PERIOD_OPTIONS)[number]['value'];
export type BdsService = (typeof BDS_SERVICE_OPTIONS)[number]['value'];

export interface BypFormFields {
  fundReceiptDuration: FundReceiptDuration | '';
  fundReceiptDurationSpecify: string;
  receivedActualAmountRequested: boolean | null;
  cashAmountReceived: number | '';
  instalmentPeriod: InstalmentPeriod | '';
  instalmentPeriodSpecify: string;
  serviceRating: Rating | '';
  performanceRating: Rating | '';
  groupOrganizedTransparently: boolean | null;
  receivedBds: boolean | null;
  bdsServices: BdsService[];
  improvementSuggestion: string;
}

export const EMPTY_BYP_FIELDS: BypFormFields = {
  fundReceiptDuration: '',
  fundReceiptDurationSpecify: '',
  receivedActualAmountRequested: null,
  cashAmountReceived: '',
  instalmentPeriod: '',
  instalmentPeriodSpecify: '',
  serviceRating: '',
  performanceRating: '',
  groupOrganizedTransparently: null,
  receivedBds: null,
  bdsServices: [],
  improvementSuggestion: '',
};

export function requiresFundDurationSpecify(duration: string): boolean {
  return duration === 'MORE_THAN_WEEK_LESS_THAN_MONTH' || duration === 'MONTHS';
}

export function requiresInstalmentSpecify(period: string): boolean {
  return period === 'OTHERS';
}
