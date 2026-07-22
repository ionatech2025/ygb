import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../../core/api/api-client';
import { DashboardCharts } from './DashboardCharts';
import type { DashboardAggregates } from '../../../../core/domain/dashboard-aggregates.model';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_DISTRICT_ID,
} from '../../../../core/domain/location-seed.constants';

vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

const sampleAggregates: DashboardAggregates = {
  totalSubmissions: 10,
  byDistrict: [{ districtName: 'Kampala', districtId: KAMPALA_DISTRICT_ID, count: 10 }],
  byGender: [
    { gender: 'FEMALE', count: 6 },
    { gender: 'MALE', count: 4 },
  ],
  overTime: [{ date: '2026-03-15', count: 10 }],
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

describe('DashboardCharts', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
    vi.clearAllMocks();
  });

  it('renders all three chart types with mocked aggregate data (TC-DASH-01-01)', async () => {
    render(<DashboardCharts dashboardApi={createDashboardApi()} />);

    expect(screen.getByTestId('dashboard-charts-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-charts')).toBeInTheDocument();
    });

    expect(screen.getByTestId('chart-submissions-over-time')).toBeInTheDocument();
    expect(screen.getByTestId('chart-submissions-by-district')).toBeInTheDocument();
    expect(screen.getByTestId('chart-gender-split')).toBeInTheDocument();
  });

  it('refetches chart data when filters change (TC-DASH-01-02)', async () => {
    const fetchAggregates = vi.fn().mockResolvedValue(sampleAggregates);
    const dashboardApi = createDashboardApi(fetchAggregates);

    const { rerender } = render(<DashboardCharts dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchAggregates).toHaveBeenCalledTimes(1);
    });

    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, formType: 'BYP' },
    });

    rerender(<DashboardCharts dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchAggregates).toHaveBeenCalledTimes(2);
    });
  });

  it('shows an error banner when loading fails', async () => {
    render(
      <DashboardCharts
        dashboardApi={createDashboardApi(vi.fn().mockRejectedValue(new Error('Network unavailable')))}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-charts-error')).toHaveTextContent('Network unavailable');
    });
  });

  it('surfaces location filter errors on the filter panel', async () => {
    useDashboardFilterStore.setState({
      filter: {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: KAMPALA_DISTRICT_ID,
        subcountyId: KAMPALA_CENTRAL_DIVISION_ID,
      },
    });

    render(
      <DashboardCharts
        dashboardApi={createDashboardApi(
          vi.fn().mockRejectedValue(new ApiError('Location not found.', 400))
        )}
      />
    );

    await waitFor(() => {
      expect(useDashboardFilterStore.getState().locationFilterError).toContain('Location not found');
    });
  });
});
