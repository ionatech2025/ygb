import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDashboardHome } from './AdminDashboardHome';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';

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
    fetchAggregates: vi.fn(),
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
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER });
  });

  it('renders filter panel plus summary stat and chart placeholder regions', async () => {
    render(<AdminDashboardHome />);

    expect(screen.getByTestId('admin-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('admin-stat-placeholders')).toBeInTheDocument();
    expect(screen.getByTestId('admin-chart-placeholders')).toBeInTheDocument();
    expect(screen.getByText('Total submissions')).toBeInTheDocument();
    expect(screen.getByText('Submissions over time')).toBeInTheDocument();
    expect(screen.getByText('Breakdown by district / form type')).toBeInTheDocument();
  });
});
