import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicDashboardSummaryCards } from './PublicDashboardSummaryCards';
import type { PublicDashboardSummary } from '../../../../core/domain/public-dashboard-summary.model';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../../core/domain/public-dashboard-filter.model';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';

const sampleSummary: PublicDashboardSummary = {
  totalSubmissions: 10,
  byFormType: [{ formType: 'BYP', count: 10 }],
  byGender: [{ gender: 'FEMALE', count: 10 }],
  byFinancialYearPeriod: [{ financialYearPeriod: 'JAN_JUN_2026', count: 10 }],
};

function createDashboardApi(
  fetchSummary: IPublicDashboardApiPort['fetchSummary'] = vi.fn().mockResolvedValue(sampleSummary)
): IPublicDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn(),
    buildFilterQueryString: vi.fn(),
    fetchSummary,
    fetchChart: vi.fn(),
    fetchHeatmap: vi.fn(),
  };
}

describe('PublicDashboardSummaryCards', () => {
  beforeEach(() => {
    usePublicDashboardFilterStore.setState({
      filter: EMPTY_PUBLIC_DASHBOARD_FILTER,
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders totals from mock API response', async () => {
    render(<PublicDashboardSummaryCards dashboardApi={createDashboardApi()} />);

    expect(screen.getByTestId('public-dashboard-summary-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-summary-cards')).toBeInTheDocument();
    });

    expect(screen.getByTestId('stat-card-total-submissions')).toHaveTextContent('10');
    expect(screen.getByTestId('stat-card-by-form-type')).toHaveTextContent('Beneficiary Young Person (BYP)');
    expect(screen.getByTestId('stat-card-gender-split')).toHaveTextContent('Female');
    expect(screen.getByTestId('stat-card-by-financial-year')).toHaveTextContent('Jan–Jun 2026');
  });

  it('refetches summary when filters change', async () => {
    const fetchSummary = vi.fn().mockResolvedValue(sampleSummary);
    const dashboardApi = createDashboardApi(fetchSummary);

    const { rerender } = render(<PublicDashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(1);
    });

    usePublicDashboardFilterStore.setState({
      filter: { ...EMPTY_PUBLIC_DASHBOARD_FILTER, formType: 'BYP' },
    });

    rerender(<PublicDashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(fetchSummary).toHaveBeenCalledTimes(2);
    });

    expect(fetchSummary).toHaveBeenLastCalledWith(expect.objectContaining({ formType: 'BYP' }));
  });

  it('does not render phone numbers or personal names in the output', async () => {
    render(<PublicDashboardSummaryCards dashboardApi={createDashboardApi()} />);

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-summary-cards')).toBeInTheDocument();
    });

    const text = screen.getByTestId('public-dashboard-summary-cards').textContent ?? '';
    expect(text).not.toMatch(/07\d{8}/);
    expect(text).not.toMatch(/Jane Collector|John Respondent|respondentName|collectorName/i);
  });

  it('shows an error banner when loading fails', async () => {
    const dashboardApi = createDashboardApi(vi.fn().mockRejectedValue(new Error('Network unavailable')));

    render(<PublicDashboardSummaryCards dashboardApi={dashboardApi} />);

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-summary-error')).toHaveTextContent('Network unavailable');
    });
  });
});
