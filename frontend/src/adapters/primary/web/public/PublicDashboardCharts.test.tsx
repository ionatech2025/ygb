import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicDashboardCharts } from './PublicDashboardCharts';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../../core/domain/public-dashboard-filter.model';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';

vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

function createDashboardApi(
  overrides: Partial<IPublicDashboardApiPort> = {}
): IPublicDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn(),
    buildFilterQueryString: vi.fn(),
    fetchSummary: vi.fn(),
    fetchChart: vi.fn().mockImplementation(async (chartType) => {
      if (chartType === 'by-district') {
        return {
          chartType,
          data: [{ label: 'Kampala', locationId: KAMPALA_DISTRICT_ID, date: null, count: 10 }],
        };
      }
      if (chartType === 'by-gender') {
        return {
          chartType,
          data: [{ label: 'FEMALE', locationId: null, date: null, count: 6 }],
        };
      }
      if (chartType === 'by-age-group') {
        return {
          chartType,
          data: [{ label: 'AGE_20_24', locationId: null, date: null, count: 4 }],
        };
      }
      return {
        chartType: 'trend',
        data: [{ label: '2026-03-15', locationId: null, date: '2026-03-15', count: 10 }],
      };
    }),
    fetchHeatmap: vi.fn().mockResolvedValue([
      { districtId: KAMPALA_DISTRICT_ID, parishId: null, label: 'Kampala', count: 10 },
    ]),
    ...overrides,
  };
}

describe('PublicDashboardCharts', () => {
  beforeEach(() => {
    usePublicDashboardFilterStore.setState({
      filter: EMPTY_PUBLIC_DASHBOARD_FILTER,
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders bar, pie, line, and heat map charts with mock data (TC-PUB-03-01)', async () => {
    render(<PublicDashboardCharts dashboardApi={createDashboardApi()} />);

    expect(screen.getByTestId('public-dashboard-charts-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-charts')).toBeInTheDocument();
    });

    expect(screen.getByTestId('chart-submissions-over-time')).toBeInTheDocument();
    expect(screen.getByTestId('chart-submissions-by-district')).toBeInTheDocument();
    expect(screen.getByTestId('chart-gender-split')).toBeInTheDocument();
    expect(screen.getByTestId('chart-age-group')).toBeInTheDocument();
    expect(screen.getByTestId('public-geographic-heatmap')).toBeInTheDocument();
  });

  it('refetches chart data when filters change (TC-PUB-03-02)', async () => {
    const fetchChart = vi.fn().mockImplementation(async (chartType: string) => ({
      chartType,
      data: [],
    }));
    const fetchHeatmap = vi.fn().mockResolvedValue([]);
    const dashboardApi = createDashboardApi({ fetchChart, fetchHeatmap });

    const { rerender } = render(<PublicDashboardCharts dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchChart).toHaveBeenCalled();
      expect(fetchHeatmap).toHaveBeenCalledTimes(1);
    });

    const initialChartCalls = fetchChart.mock.calls.length;

    usePublicDashboardFilterStore.setState({
      filter: { ...EMPTY_PUBLIC_DASHBOARD_FILTER, formType: 'BYP' },
    });

    rerender(<PublicDashboardCharts dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchChart.mock.calls.length).toBeGreaterThan(initialChartCalls);
      expect(fetchHeatmap).toHaveBeenCalledTimes(2);
    });
  });
});
