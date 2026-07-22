import { describe, expect, it } from 'vitest';
import {
  deriveFinancialYearPeriod,
  formatFinancialYearPeriodLabel,
  toFinancialYearPeriodKey,
} from './financial-year-period';

describe('financial-year-period', () => {
  it('derives JAN_JUN_2026 for March 2026 (TC-UNIQ-01-01)', () => {
    const period = deriveFinancialYearPeriod(new Date(2026, 2, 15, 12, 0));
    expect(period.period).toBe('JAN_JUN');
    expect(period.year).toBe(2026);
    expect(toFinancialYearPeriodKey(period)).toBe('JAN_JUN_2026');
  });

  it('uses JAN_JUN through June 30 and JUL_DEC from July 1 (TC-UNIQ-01-03)', () => {
    const june = deriveFinancialYearPeriod(new Date(2026, 5, 30, 23, 59));
    const july = deriveFinancialYearPeriod(new Date(2026, 6, 1, 0, 0));

    expect(toFinancialYearPeriodKey(june)).toBe('JAN_JUN_2026');
    expect(toFinancialYearPeriodKey(july)).toBe('JUL_DEC_2026');
  });

  it('derives JUL_DEC_2026 for August 2026', () => {
    const period = deriveFinancialYearPeriod(new Date(2026, 7, 10, 9, 0));
    expect(toFinancialYearPeriodKey(period)).toBe('JUL_DEC_2026');
  });

  it('formats human labels for UI messages (TC-UNIQ-01-04)', () => {
    expect(
      formatFinancialYearPeriodLabel({ period: 'JAN_JUN', year: 2026 })
    ).toBe('Jan–Jun 2026');
    expect(
      formatFinancialYearPeriodLabel({ period: 'JUL_DEC', year: 2026 })
    ).toBe('Jul–Dec 2026');
  });
});
