import { describe, expect, it } from 'vitest';
import {
  applyBudgetPriorityDashboardFilterPatch,
  buildBudgetPriorityDashboardFilterQueryString,
  budgetPriorityDashboardFilterFromSearchParams,
  EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
  hasActiveBudgetPriorityDashboardFilters,
} from './budget-priority-dashboard-filter.model';

describe('budget-priority-dashboard-filter.model', () => {
  it('serializes active filters to query string', () => {
    const query = buildBudgetPriorityDashboardFilterQueryString({
      ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
      section: 'health',
      districtId: 'district-1',
      gender: 'FEMALE',
    });

    expect(query).toContain('section=health');
    expect(query).toContain('districtId=district-1');
    expect(query).toContain('gender=FEMALE');
  });

  it('parses filters from URL search params', () => {
    const params = new URLSearchParams('section=agriculture&financialYearPeriod=JAN_JUN_2026');
    expect(budgetPriorityDashboardFilterFromSearchParams(params)).toEqual({
      ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
      section: 'agriculture',
      financialYearPeriod: 'JAN_JUN_2026',
    });
  });

  it('clears child locations when district changes', () => {
    const next = applyBudgetPriorityDashboardFilterPatch(
      {
        ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
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
    expect(hasActiveBudgetPriorityDashboardFilters(EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER)).toBe(false);
    expect(
      hasActiveBudgetPriorityDashboardFilters({
        ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
        section: 'climate',
      })
    ).toBe(true);
  });
});
