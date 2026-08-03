import type { Rating } from './form-validation.model';

export const FUND_RECEIPT_DURATION_OPTIONS = [
  { value: 'ONE_WEEK', label: 'A week' },
  { value: 'MORE_THAN_WEEK_LESS_THAN_MONTH', label: 'More than a week and less than a month (specify)' },
  { value: 'MONTH', label: 'A month' },
  { value: 'MONTHS', label: 'Months (specify)' },
] as const;

export const LOAN_REPAYMENT_DURATION_OPTIONS = [
  { value: 'ZERO_TO_SIX_MONTHS', label: '0-6 months' },
  { value: 'SEVEN_TO_ELEVEN_MONTHS', label: '7-11 months' },
  { value: 'TWELVE_TO_EIGHTEEN_MONTHS', label: '12-18 months' },
  { value: 'EIGHTEEN_TO_TWENTY_FOUR_MONTHS', label: '18-24 months' },
] as const;

export const BDS_OTHERS_OPTION_VALUE = 'OTHERS';

export const BDS_SERVICE_OPTIONS = [
  {
    value: 'TRAINING',
    label:
      'Training to improve productivity, efficiency, profitability, business viability, and supply chain participation',
  },
  { value: 'MARKET_LINKAGES', label: 'Market linkages' },
  { value: 'EXTENSION_SERVICE', label: 'Extension service' },
  { value: BDS_OTHERS_OPTION_VALUE, label: 'Others (specify)' },
] as const;

export type FundReceiptDuration = (typeof FUND_RECEIPT_DURATION_OPTIONS)[number]['value'];
export type LoanRepaymentDuration = (typeof LOAN_REPAYMENT_DURATION_OPTIONS)[number]['value'];
export type BdsService = (typeof BDS_SERVICE_OPTIONS)[number]['value'];

export interface BypFormFields {
  fundReceiptDuration: FundReceiptDuration | '';
  fundReceiptDurationSpecify: string;
  receivedActualAmountRequested: boolean | null;
  cashAmountReceived: number | '';
  fundsReceiptWaitAfterApplied: string;
  moneyUsedFor: string;
  serviceRating: Rating | '';
  loanRepaid: boolean | null;
  loanRepaymentDuration: LoanRepaymentDuration | '';
  performanceRating: Rating | '';
  groupOrganizedTransparently: boolean | null;
  receivedBds: boolean | null;
  bdsServices: BdsService[];
  bdsServicesOthersSpecify: string;
  improvementSuggestion: string;
}

export const EMPTY_BYP_FIELDS: BypFormFields = {
  fundReceiptDuration: '',
  fundReceiptDurationSpecify: '',
  receivedActualAmountRequested: null,
  cashAmountReceived: '',
  fundsReceiptWaitAfterApplied: '',
  moneyUsedFor: '',
  serviceRating: '',
  loanRepaid: null,
  loanRepaymentDuration: '',
  performanceRating: '',
  groupOrganizedTransparently: null,
  receivedBds: null,
  bdsServices: [],
  bdsServicesOthersSpecify: '',
  improvementSuggestion: '',
};

export function requiresFundDurationSpecify(duration: string): boolean {
  return duration === 'MORE_THAN_WEEK_LESS_THAN_MONTH' || duration === 'MONTHS';
}

export function requiresLoanRepaymentDuration(loanRepaid: boolean | null): boolean {
  return loanRepaid === true;
}

export function requiresBdsOthersSpecify(selected: readonly string[]): boolean {
  return selected.includes(BDS_OTHERS_OPTION_VALUE);
}

export function encodeBdsServices(selected: string[], specify: string): string[] {
  if (!requiresBdsOthersSpecify(selected)) {
    return selected;
  }
  const trimmed = specify.trim();
  return selected.map((value) =>
    value === BDS_OTHERS_OPTION_VALUE ? `${BDS_OTHERS_OPTION_VALUE}:${trimmed}` : value
  );
}
