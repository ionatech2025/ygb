export type FinancialYearPeriodHalf = 'JAN_JUN' | 'JUL_DEC';

export interface FinancialYearPeriod {
  period: FinancialYearPeriodHalf;
  year: number;
}

/** Canonical key aligned with backend FinancialYearPeriod.toString(), e.g. JAN_JUN_2026 */
export type FinancialYearPeriodKey = `${FinancialYearPeriodHalf}_${number}`;
