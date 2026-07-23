import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import type { IBudgetPriorityDashboardApiPort } from '../../../../ports/budget-priority-dashboard-api.port';
import { BudgetPrioritySummaryCards } from './BudgetPrioritySummaryCards';

const PHONE_PATTERN = /(\+256|0)?7\d{8}/;

function createMockApi(
  fetchSummary = vi.fn().mockResolvedValue({
    totalSubmissions: 5,
    bySection: [{ section: 'health', count: 5 }],
    topPriorityAreas: [{ priorityArea: 'PRIMARY_HEALTH_CARE', count: 3 }],
  })
): IBudgetPriorityDashboardApiPort {
  return {
    buildFilterQueryString: vi.fn(),
    fetchFilterOptions: vi.fn().mockResolvedValue({
      sections: ['health', 'agriculture'],
      genders: ['FEMALE'],
      ageGroups: ['AGE_20_24'],
      financialYearPeriods: ['JAN_JUN_2026'],
    }),
    fetchSummary,
    fetchChart: vi.fn(),
  };
}

describe('BudgetPrioritySummaryCards', () => {
  beforeEach(() => {
    useBudgetPriorityDashboardFilterStore.setState({
      filter: EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
      locationFilterError: null,
    });
  });

  it('refetches summary when section filter changes', async () => {
    const fetchSummary = vi.fn().mockResolvedValue({
      totalSubmissions: 0,
      bySection: [],
      topPriorityAreas: [],
    });

    render(<BudgetPrioritySummaryCards dashboardApi={createMockApi(fetchSummary)} />);

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(1);
    });

    useBudgetPriorityDashboardFilterStore.getState().setFilter({ section: 'health' });

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(2);
    });

    expect(fetchSummary.mock.calls[1]?.[0]).toEqual(
      expect.objectContaining({ section: 'health' })
    );
  });

  it('shows empty state when dataset has zero submissions', async () => {
    render(
      <BudgetPrioritySummaryCards
        dashboardApi={createMockApi(
          vi.fn().mockResolvedValue({
            totalSubmissions: 0,
            bySection: [],
            topPriorityAreas: [],
          })
        )}
      />
    );

    expect(await screen.findByTestId('bp-dashboard-empty-state')).toBeInTheDocument();
  });

  it('does not render phone-like patterns from API responses', async () => {
    render(
      <BudgetPrioritySummaryCards
        dashboardApi={createMockApi(
          vi.fn().mockResolvedValue({
            totalSubmissions: 2,
            bySection: [{ section: 'health', count: 2 }],
            topPriorityAreas: [{ priorityArea: '0772123456', count: 1 }],
          })
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('budget-priority-summary-cards')).toBeInTheDocument();
    });

    expect(PHONE_PATTERN.test(document.body.textContent ?? '')).toBe(false);
    expect(screen.queryByText(/0772123456/)).not.toBeInTheDocument();
  });
});
