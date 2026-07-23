import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER } from '../../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { useLgoBudgetAllocationDashboardFilterStore } from '../../../../core/store/useLgoBudgetAllocationDashboardFilterStore';
import type { ILgoBudgetAllocationDashboardApiPort } from '../../../../ports/lgo-budget-allocation-dashboard-api.port';
import { LgoBudgetAllocationSummaryCards } from './LgoBudgetAllocationSummaryCards';

const PHONE_PATTERN = /(\+256|0)?7\d{8}/;

function createMockApi(
  fetchSummary = vi.fn().mockResolvedValue({
    totalSubmissions: 5,
    byDistrict: [{ districtId: 'd1', districtLabel: 'Kampala', count: 5 }],
    topSectors: [{ sector: 'health', count: 3 }],
  })
): ILgoBudgetAllocationDashboardApiPort {
  return {
    buildFilterQueryString: vi.fn(),
    fetchFilterOptions: vi.fn().mockResolvedValue({
      genders: ['FEMALE'],
      ageGroups: ['AGE_20_24'],
      financialYearPeriods: ['JAN_JUN_2026'],
    }),
    fetchSummary,
    fetchChart: vi.fn(),
  };
}

describe('LgoBudgetAllocationSummaryCards', () => {
  beforeEach(() => {
    useLgoBudgetAllocationDashboardFilterStore.setState({
      filter: EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
      locationFilterError: null,
    });
  });

  it('refetches summary when district filter changes', async () => {
    const fetchSummary = vi.fn().mockResolvedValue({
      totalSubmissions: 0,
      byDistrict: [],
      topSectors: [],
    });

    render(<LgoBudgetAllocationSummaryCards dashboardApi={createMockApi(fetchSummary)} />);

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(1);
    });

    useLgoBudgetAllocationDashboardFilterStore.getState().setFilter({ districtId: 'district-1' });

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(2);
    });

    expect(fetchSummary.mock.calls[1]?.[0]).toEqual(
      expect.objectContaining({ districtId: 'district-1' })
    );
  });

  it('shows empty state when dataset has zero submissions', async () => {
    render(
      <LgoBudgetAllocationSummaryCards
        dashboardApi={createMockApi(
          vi.fn().mockResolvedValue({
            totalSubmissions: 0,
            byDistrict: [],
            topSectors: [],
          })
        )}
      />
    );

    expect(await screen.findByTestId('lgo-dashboard-empty-state')).toBeInTheDocument();
  });

  it('does not render phone-like patterns from API responses', async () => {
    render(
      <LgoBudgetAllocationSummaryCards
        dashboardApi={createMockApi(
          vi.fn().mockResolvedValue({
            totalSubmissions: 2,
            byDistrict: [{ districtId: 'd1', districtLabel: '0772123456', count: 2 }],
            topSectors: [{ sector: 'health', count: 1 }],
          })
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('lgo-budget-allocation-summary-cards')).toBeInTheDocument();
    });

    expect(PHONE_PATTERN.test(document.body.textContent ?? '')).toBe(false);
    expect(screen.queryByText(/0772123456/)).not.toBeInTheDocument();
  });
});
