import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectorTrackerPage } from './CollectorTrackerPage';
import { CollectorTrackerService } from '../../../../core/CollectorTrackerService';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { ICollectorTrackerApiPort } from '../../../../ports/collector-tracker-api.port';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';

const leaderboard = [
  { collectorId: 'collector-2', fullName: 'Katongole', totalCount: 4 },
  { collectorId: 'collector-1', fullName: 'Default Collector', totalCount: 6 },
  { collectorId: 'collector-3', fullName: 'Samuel', totalCount: 2 },
];

const breakdown = {
  byFormType: [
    { formType: 'BYP', count: 2 },
    { formType: 'IYP', count: 1 },
  ],
  byDistrict: [
    { districtId: 'district-1', districtName: 'Kampala', count: 2 },
    { districtId: 'district-2', districtName: 'Ntungamo', count: 1 },
  ],
};

function createTrackerApi(
  overrides: Partial<ICollectorTrackerApiPort> = {}
): ICollectorTrackerApiPort {
  return {
    fetchLeaderboard: vi.fn().mockResolvedValue(leaderboard),
    fetchBreakdown: vi.fn().mockResolvedValue(breakdown),
    ...overrides,
  };
}

const dashboardApi: IDashboardApiPort = {
  fetchFilterOptions: vi.fn().mockResolvedValue({
    districts: [],
    subcounties: [],
    parishes: [],
    formTypes: [],
    genders: [],
    ageGroups: [],
    collectors: [],
    financialYearPeriods: ['JAN_JUN_2026', 'JUL_DEC_2026'],
  }),
  buildFilterQueryString: vi.fn(),
  fetchAggregates: vi.fn(),
};

describe('CollectorTrackerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
  });

  it('renders the leaderboard sorted by submission count descending', async () => {
    const trackerApi = createTrackerApi();
    const trackerService = new CollectorTrackerService(trackerApi);

    render(
      <CollectorTrackerPage trackerApi={trackerApi} dashboardApi={dashboardApi} trackerService={trackerService} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('leaderboard-row-collector-1')).toBeInTheDocument();
    });

    const rowIds = screen
      .getAllByTestId(/^leaderboard-row-/)
      .map((row) => row.getAttribute('data-testid')?.replace('leaderboard-row-', ''));

    expect(rowIds).toEqual(['collector-1', 'collector-2', 'collector-3']);
  });

  it('shows form type and district breakdown when a row is expanded (TC-DASH-07-03)', async () => {
    const user = userEvent.setup();
    const trackerApi = createTrackerApi();
    const trackerService = new CollectorTrackerService(trackerApi);

    render(
      <CollectorTrackerPage trackerApi={trackerApi} dashboardApi={dashboardApi} trackerService={trackerService} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('leaderboard-expand-collector-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('leaderboard-expand-collector-1'));

    await waitFor(() => {
      expect(trackerApi.fetchBreakdown).toHaveBeenCalledWith('collector-1', EMPTY_DASHBOARD_FILTER);
      expect(screen.getByTestId('collector-breakdown-panel')).toBeInTheDocument();
      expect(screen.getByTestId('breakdown-form-type-BYP')).toHaveTextContent('2');
      expect(screen.getByTestId('breakdown-district-district-1')).toHaveTextContent('Kampala');
      expect(screen.getByTestId('breakdown-district-district-1')).toHaveTextContent('2');
    });
  });

  it('refetches the leaderboard when the financial year filter changes (TC-DASH-07-02)', async () => {
    const user = userEvent.setup();
    const fetchLeaderboard = vi.fn().mockResolvedValue(leaderboard);
    const trackerApi = createTrackerApi({ fetchLeaderboard });
    const trackerService = new CollectorTrackerService(trackerApi);

    render(
      <CollectorTrackerPage trackerApi={trackerApi} dashboardApi={dashboardApi} trackerService={trackerService} />
    );

    await waitFor(() => {
      expect(fetchLeaderboard).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', { name: /^Filters/i }));
    await user.selectOptions(screen.getByTestId('filter-financial-year'), 'JAN_JUN_2026');

    await waitFor(() => {
      expect(fetchLeaderboard).toHaveBeenCalledWith(
        expect.objectContaining({ financialYearPeriod: 'JAN_JUN_2026' })
      );
    });
  });
});
