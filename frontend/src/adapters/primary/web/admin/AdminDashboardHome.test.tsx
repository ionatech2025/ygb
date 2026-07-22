import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDashboardHome } from './AdminDashboardHome';
import type { DashboardAggregates } from '../../../../core/domain/dashboard-aggregates.model';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';

const emptyAggregates: DashboardAggregates = {
  totalSubmissions: 0,
  byDistrict: [],
  byGender: [],
  overTime: [],
  byFormType: [],
  byFinancialYearPeriod: [],
};

vi.mock('../../../secondary/api/dashboard-api.adapter', () => ({
  HttpDashboardAdapter: vi.fn().mockImplementation(() => ({
    fetchFilterOptions: vi.fn().mockResolvedValue({
      districts: [],
      subcounties: [],
      parishes: [],
      formTypes: [],
      genders: [],
      ageGroups: [],
      collectors: [],
      financialYearPeriods: [],
    }),
    buildFilterQueryString: vi.fn(),
    fetchAggregates: vi.fn().mockResolvedValue(emptyAggregates),
  })),
}));

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { getAccessToken: () => string }) => unknown) =>
    selector({ getAccessToken: () => 'test-token' }),
}));

describe('AdminDashboardHome', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
  });

  it('renders filter panel, summary cards, and chart placeholders', async () => {
    render(<AdminDashboardHome />);

    expect(screen.getByTestId('admin-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-filter-panel')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-summary-cards')).toBeInTheDocument();
    });

    expect(screen.getByTestId('admin-chart-placeholders')).toBeInTheDocument();
    expect(screen.getByText('Submissions over time')).toBeInTheDocument();
    expect(screen.getByText('Breakdown by district / form type')).toBeInTheDocument();
  });
});
