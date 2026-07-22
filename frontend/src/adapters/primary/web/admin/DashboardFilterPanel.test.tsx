import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardFilterPanel } from './DashboardFilterPanel';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';

import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_CENTRAL_PARISH_ID,
  KAMPALA_DISTRICT_ID,
  LEGACY_ARUA_DISTRICT_ID,
} from '../../../../core/domain/location-seed.constants';

const district = { id: KAMPALA_DISTRICT_ID, name: 'Kampala' };
const subcounty = { id: KAMPALA_CENTRAL_DIVISION_ID, name: 'Kampala Central Division' };
const parish = { id: KAMPALA_CENTRAL_PARISH_ID, name: 'Kampala Central' };

function createDashboardApi(
  overrides: Partial<IDashboardApiPort> = {}
): IDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn().mockImplementation(async (districtId?: string, subcountyId?: string) => ({
      districts: [district],
      subcounties: districtId ? [subcounty] : [],
      parishes: subcountyId ? [parish] : [],
      formTypes: ['BYP'],
      genders: ['MALE'],
      ageGroups: ['AGE_15_19'],
      collectors: [{ id: 'c1', fullName: 'Jane Collector' }],
      financialYearPeriods: ['JAN_JUN_2026'],
    })),
    buildFilterQueryString: vi.fn(),
    fetchAggregates: vi.fn(),
    ...overrides,
  };
}

describe('DashboardFilterPanel', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
    vi.clearAllMocks();
  });

  it('renders all nine filter dimensions (TC-DASH-02-01)', async () => {
    render(<DashboardFilterPanel dashboardApi={createDashboardApi()} />);

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());

    expect(screen.getByTestId('filter-location')).toBeInTheDocument();
    expect(screen.getByTestId('admin-dashboard-location-selector')).toBeInTheDocument();
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
        districtId: district.id,
        formType: 'BYP',
        gender: 'MALE',
      },
    });

    const user = userEvent.setup();
    render(<DashboardFilterPanel dashboardApi={createDashboardApi()} />);

    await user.click(screen.getByTestId('dashboard-filter-clear-all'));

    expect(useDashboardFilterStore.getState().filter).toEqual(EMPTY_DASHBOARD_FILTER);
    expect(screen.queryByTestId('dashboard-filter-clear-all')).not.toBeInTheDocument();
  });

  it('repopulates sub-counties after a district is selected from dashboard filter options', async () => {
    const dashboardApi = createDashboardApi();
    const user = userEvent.setup();

    render(<DashboardFilterPanel dashboardApi={dashboardApi} />);

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());
    await user.selectOptions(screen.getByLabelText(/^District/i), district.id);

    await waitFor(() => {
      expect(screen.getByLabelText(/Sub-county/i)).not.toBeDisabled();
    });

    expect(screen.getByLabelText(/Sub-county/i)).toHaveTextContent('Kampala Central Division');
    expect(useDashboardFilterStore.getState().filter.districtId).toBe(district.id);
  });

  it('clears outdated location filters from the URL against dashboard filter options', async () => {
    useDashboardFilterStore.setState({
      filter: {
        ...EMPTY_DASHBOARD_FILTER,
        districtId: LEGACY_ARUA_DISTRICT_ID,
        gender: 'MALE',
      },
    });

    render(<DashboardFilterPanel dashboardApi={createDashboardApi()} />);

    await waitFor(() => {
      expect(useDashboardFilterStore.getState().filter.districtId).toBe('');
      expect(useDashboardFilterStore.getState().filter.gender).toBe('MALE');
    });

    expect(screen.getByTestId('dashboard-location-filter-error')).toBeInTheDocument();
  });
});
