import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardFilterPanel } from './DashboardFilterPanel';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

const district: AdminLocation = {
  id: 'district-1',
  name: 'Kampala',
  parentId: null,
  level: 'DISTRICT',
};

const subcounty: AdminLocation = {
  id: 'subcounty-1',
  name: 'Central Division',
  parentId: district.id,
  level: 'SUBCOUNTY',
};

function createRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn(),
    clear: vi.fn(),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => (level === 'DISTRICT' ? [district] : [])),
    findByParentId: vi.fn().mockImplementation(async (parentId) =>
      parentId === district.id ? [subcounty] : []
    ),
  };
}

function createDashboardApi(): IDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn().mockResolvedValue({
      districts: [],
      subcounties: [],
      parishes: [],
      formTypes: ['BYP'],
      genders: ['MALE'],
      ageGroups: ['AGE_15_19'],
      collectors: [{ id: 'c1', fullName: 'Jane Collector' }],
      financialYearPeriods: ['JAN_JUN_2026'],
    }),
    buildFilterQueryString: vi.fn(),
    fetchAggregates: vi.fn(),
  };
}

describe('DashboardFilterPanel', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER });
    vi.clearAllMocks();
  });

  it('renders all nine filter dimensions (TC-DASH-02-01)', async () => {
    render(
      <DashboardFilterPanel
        dashboardApi={createDashboardApi()}
        locationRepository={createRepository()}
      />
    );

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());

    expect(screen.getByTestId('filter-location')).toBeInTheDocument();
    expect(screen.getByLabelText(/^District/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sub-county/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Parish/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Village/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-form-type')).toBeInTheDocument();
    expect(screen.getByTestId('filter-date-from')).toBeInTheDocument();
    expect(screen.getByTestId('filter-date-to')).toBeInTheDocument();
    expect(screen.getByTestId('filter-gender')).toBeInTheDocument();
    expect(screen.getByTestId('filter-age-group')).toBeInTheDocument();
    expect(screen.getByTestId('filter-collector')).toBeInTheDocument();
    expect(screen.getByTestId('filter-financial-year')).toBeInTheDocument();
  });

  it('clears all filters when Clear all is clicked (TC-DASH-02-04)', async () => {
    useDashboardFilterStore.setState({
      filter: {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: 'district-1',
        formType: 'BYP',
        gender: 'MALE',
      },
    });

    const user = userEvent.setup();
    render(
      <DashboardFilterPanel
        dashboardApi={createDashboardApi()}
        locationRepository={createRepository()}
      />
    );

    await user.click(screen.getByTestId('dashboard-filter-clear-all'));

    expect(useDashboardFilterStore.getState().filter).toEqual(EMPTY_DASHBOARD_FILTER);
    expect(screen.queryByTestId('dashboard-filter-clear-all')).not.toBeInTheDocument();
  });

  it('repopulates sub-counties after district change from cached locations', async () => {
    const repository = createRepository();
    const user = userEvent.setup();

    render(
      <DashboardFilterPanel dashboardApi={createDashboardApi()} locationRepository={repository} />
    );

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());
    await user.selectOptions(screen.getByLabelText(/^District/i), district.id);

    await waitFor(() => {
      expect(screen.getByLabelText(/Sub-county/i)).not.toBeDisabled();
    });

    const subcountySelect = screen.getByLabelText(/Sub-county/i);
    expect(subcountySelect).toHaveTextContent('Central Division');
    expect(useDashboardFilterStore.getState().filter.districtId).toBe(district.id);
  });
});
