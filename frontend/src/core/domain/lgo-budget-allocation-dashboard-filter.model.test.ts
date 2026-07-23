import { describe, expect, it } from 'vitest';
import {
  applyLgoBudgetAllocationDashboardFilterPatch,
  buildLgoBudgetAllocationDashboardFilterQueryString,
  EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
  hasActiveLgoBudgetAllocationDashboardFilters,
  lgoBudgetAllocationDashboardFilterFromSearchParams,
} from './lgo-budget-allocation-dashboard-filter.model';

describe('lgo-budget-allocation-dashboard-filter.model', () => {
  it('serializes active filters to query string', () => {
    const query = buildLgoBudgetAllocationDashboardFilterQueryString({
      ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      districtId: 'district-1',
      gender: 'FEMALE',
      financialYearPeriod: 'JAN_JUN_2026',
    });

    expect(query).toContain('districtId=district-1');
    expect(query).toContain('gender=FEMALE');
    expect(query).toContain('financialYearPeriod=JAN_JUN_2026');
  });

  it('parses filters from URL search params', () => {
    const params = new URLSearchParams('districtId=d1&financialYearPeriod=JUL_DEC_2025');
    expect(lgoBudgetAllocationDashboardFilterFromSearchParams(params)).toEqual({
      ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      districtId: 'd1',
      financialYearPeriod: 'JUL_DEC_2025',
    });
  });

  it('clears child locations when district changes', () => {
    const next = applyLgoBudgetAllocationDashboardFilterPatch(
      {
        ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
        districtId: 'd1',
        subcountyId: 's1',
        parishId: 'p1',
      },
      { districtId: 'd2' }
    );

    expect(next.subcountyId).toBe('');
    expect(next.parishId).toBe('');
  });

  it('detects active filters', () => {
    expect(hasActiveLgoBudgetAllocationDashboardFilters(EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER)).toBe(
      false
    );
    expect(
      hasActiveLgoBudgetAllocationDashboardFilters({
        ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
        gender: 'MALE',
      })
    ).toBe(true);
  });
});
