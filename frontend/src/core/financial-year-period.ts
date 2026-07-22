import type {
  FinancialYearPeriod,
  FinancialYearPeriodHalf,
  FinancialYearPeriodKey,
} from './domain/financial-year-period.model';

export function deriveFinancialYearPeriod(date: Date = new Date()): FinancialYearPeriod {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const period: FinancialYearPeriodHalf = month >= 1 && month <= 6 ? 'JAN_JUN' : 'JUL_DEC';
  return { period, year };
}

export function toFinancialYearPeriodKey(period: FinancialYearPeriod): FinancialYearPeriodKey {
  return `${period.period}_${period.year}`;
}

export function formatFinancialYearPeriodLabel(period: FinancialYearPeriod): string {
  const halfLabel = period.period === 'JAN_JUN' ? 'Jan–Jun' : 'Jul–Dec';
  return `${halfLabel} ${period.year}`;
}
