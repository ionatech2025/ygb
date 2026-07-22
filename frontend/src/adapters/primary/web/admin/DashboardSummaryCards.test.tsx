import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../../core/api/api-client';
import { DashboardSummaryCards } from './DashboardSummaryCards';
import type { DashboardAggregates } from '../../../../core/domain/dashboard-aggregates.model';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_DISTRICT_ID,
} from '../../../../core/domain/location-seed.constants';

const district = { id: KAMPALA_DISTRICT_ID, name: 'Kampala' };
const subcounty = { id: KAMPALA_CENTRAL_DIVISION_ID, name: 'Kampala Central Division' };

const sampleAggregates: DashboardAggregates = {
  totalSubmissions: 10,
  byDistrict: [{ districtName: 'Kampala', districtId: KAMPALA_DISTRICT_ID, count: 10 }],
  byGender: [{ gender: 'FEMALE', count: 10 }],
  overTime: [],
  byFormType: [{ formType: 'BYP', count: 10 }],
  byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 10 }],
};

function createDashboardApi(
  fetchAggregates: IDashboardApiPort['fetchAggregates'] = vi.fn().mockResolvedValue(sampleAggregates)
): IDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn(),
    buildFilterQueryString: vi.fn(),
    fetchAggregates,
  };
}

describe('DashboardSummaryCards', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
    vi.clearAllMocks();
  });

  it('renders cards with mocked aggregate data', async () => {
    render(<DashboardSummaryCards dashboardApi={createDashboardApi()} />);

    expect(screen.getByTestId('dashboard-summary-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-summary-cards')).toBeInTheDocument();
    });

    expect(screen.getByTestId('stat-card-total-submissions')).toHaveTextContent('10');
    expect(screen.getByTestId('stat-card-by-form-type')).toHaveTextContent('Beneficiary Young Person (BYP)');
    expect(screen.getByTestId('stat-card-top-districts')).toHaveTextContent('Kampala');
    expect(screen.getByTestId('stat-card-gender-split')).toHaveTextContent('Female');
    expect(screen.getByTestId('stat-card-by-financial-year')).toHaveTextContent('Jan–Jun 2026');
  });

  it('refetches aggregates when filters change (TC-DASH-03-02)', async () => {
    const fetchAggregates = vi.fn().mockResolvedValue(sampleAggregates);
    const dashboardApi = createDashboardApi(fetchAggregates);

    const { rerender } = render(<DashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchAggregates).toHaveBeenCalledTimes(1);
    });

    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, formType: 'BYP' },
    });

    rerender(<DashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchAggregates).toHaveBeenCalledTimes(2);
    });

    expect(fetchAggregates).toHaveBeenLastCalledWith(
      expect.objectContaining({ formType: 'BYP' })
    );
  });

  it('shows an error banner when loading fails', async () => {
    const dashboardApi = createDashboardApi(
      vi.fn().mockRejectedValue(new Error('Network unavailable'))
    );

    render(<DashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-summary-error')).toHaveTextContent('Network unavailable');
    });
  });

  it('surfaces location filter errors on the filter panel without clearing other filters', async () => {
    useDashboardFilterStore.setState({
      filter: {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: district.id,
        subcountyId: subcounty.id,
        gender: 'MALE',
      },
    });

    const dashboardApi = createDashboardApi(
      vi.fn().mockRejectedValue(new ApiError('Location not found.', 400))
    );

    render(<DashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(useDashboardFilterStore.getState().filter.districtId).toBe(district.id);
      expect(useDashboardFilterStore.getState().filter.gender).toBe('MALE');
      expect(useDashboardFilterStore.getState().locationFilterError).toContain('Location not found');
    });

    expect(screen.queryByTestId('dashboard-summary-error')).not.toBeInTheDocument();
  });
});
