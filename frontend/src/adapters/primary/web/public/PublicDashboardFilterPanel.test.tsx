import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicDashboardFilterPanel } from './PublicDashboardFilterPanel';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../../core/domain/public-dashboard-filter.model';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import { usePublicDashboardFilterUrlSync } from '../../../../core/hooks/usePublicDashboardFilterUrlSync';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_DISTRICT_ID,
  LEGACY_ARUA_DISTRICT_ID,
} from '../../../../core/domain/location-seed.constants';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

const district: AdminLocation = {
  id: KAMPALA_DISTRICT_ID,
  name: 'Kampala',
  parentId: null,
  level: 'DISTRICT',
};

const subcounty: AdminLocation = {
  id: KAMPALA_CENTRAL_DIVISION_ID,
  name: 'Kampala Central Division',
  parentId: district.id,
  level: 'SUBCOUNTY',
};

function createLocationRepository(): ILocationRepositoryPort {
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

function createDashboardApi(overrides: Partial<IPublicDashboardApiPort> = {}): IPublicDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn().mockResolvedValue({
      formTypes: ['BYP'],
      genders: ['MALE'],
      ageGroups: ['AGE_15_19'],
      financialYearPeriods: ['JAN_JUN_2026'],
    }),
    buildFilterQueryString: vi.fn(),
    fetchSummary: vi.fn(),
    fetchChart: vi.fn(),
    fetchHeatmap: vi.fn(),
    ...overrides,
  };
}

function SearchParamsProbe() {
  const [params] = useSearchParams();
  return <div data-testid="url-search-params">{params.toString()}</div>;
}

function PublicDashboardFilterHarness({
  dashboardApi,
  locationRepository,
}: {
  dashboardApi: IPublicDashboardApiPort;
  locationRepository: ILocationRepositoryPort;
}) {
  usePublicDashboardFilterUrlSync();
  return (
    <>
      <PublicDashboardFilterPanel dashboardApi={dashboardApi} locationRepository={locationRepository} />
      <SearchParamsProbe />
    </>
  );
}

describe('PublicDashboardFilterPanel', () => {
  beforeEach(() => {
    usePublicDashboardFilterStore.setState({
      filter: EMPTY_PUBLIC_DASHBOARD_FILTER,
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders all eight filter dimensions (TC-PUB-02-01)', async () => {
    render(
      <PublicDashboardFilterPanel
        dashboardApi={createDashboardApi()}
        locationRepository={createLocationRepository()}
      />
    );

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());

    expect(screen.getByTestId('filter-location')).toBeInTheDocument();
    expect(screen.getByTestId('cascading-location-selector')).toBeInTheDocument();
    expect(screen.getByLabelText(/^District/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sub-county/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Parish/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Village/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-form-type')).toBeInTheDocument();
    expect(screen.getByTestId('filter-date-from')).toBeInTheDocument();
    expect(screen.getByTestId('filter-date-to')).toBeInTheDocument();
    expect(screen.getByTestId('filter-gender')).toBeInTheDocument();
    expect(screen.getByTestId('filter-age-group')).toBeInTheDocument();
    expect(screen.getByTestId('filter-financial-year')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-collector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('filter-programme-area')).not.toBeInTheDocument();
  });

  it('clears all filters and URL params when Clear all is clicked', async () => {
    usePublicDashboardFilterStore.setState({
      filter: {
        ...EMPTY_PUBLIC_DASHBOARD_FILTER,
        districtId: district.id,
        formType: 'BYP',
        gender: 'MALE',
      },
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard?districtId=d1&gender=MALE&formType=BYP']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PublicDashboardFilterHarness
                dashboardApi={createDashboardApi()}
                locationRepository={createLocationRepository()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByTestId('public-dashboard-filter-clear-all'));

    expect(usePublicDashboardFilterStore.getState().filter).toEqual(EMPTY_PUBLIC_DASHBOARD_FILTER);
    await waitFor(() => {
      expect(screen.getByTestId('url-search-params')).toHaveTextContent('');
    });
    expect(screen.queryByTestId('public-dashboard-filter-clear-all')).not.toBeInTheDocument();
  });

  it('applies saved URL filters on mount (TC-PUB-05-02)', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard?districtId=d1&gender=MALE']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PublicDashboardFilterHarness
                dashboardApi={createDashboardApi()}
                locationRepository={createLocationRepository()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(usePublicDashboardFilterStore.getState().filter.districtId).toBe('d1');
      expect(usePublicDashboardFilterStore.getState().filter.gender).toBe('MALE');
    });
  });

  it('clears outdated location filters against the public location dataset', async () => {
    usePublicDashboardFilterStore.setState({
      filter: {
        ...EMPTY_PUBLIC_DASHBOARD_FILTER,
        districtId: LEGACY_ARUA_DISTRICT_ID,
        gender: 'MALE',
      },
    });

    render(
      <PublicDashboardFilterPanel
        dashboardApi={createDashboardApi()}
        locationRepository={createLocationRepository()}
      />
    );

    await waitFor(() => {
      expect(usePublicDashboardFilterStore.getState().filter.districtId).toBe('');
      expect(usePublicDashboardFilterStore.getState().filter.gender).toBe('MALE');
    });

    expect(screen.getByTestId('public-dashboard-location-filter-error')).toBeInTheDocument();
  });
});
