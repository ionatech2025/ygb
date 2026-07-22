import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectorProfilePage } from './CollectorProfilePage';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import type { IUserRepositoryPort } from '../../../../ports/user-repository.port';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';

const sampleSubmission = {
  id: 'submission-1',
  formType: 'BYP' as const,
  respondentName: 'John Doe',
  districtId: KAMPALA_DISTRICT_ID,
  districtName: 'Kampala',
  collectorId: 'collector-1',
  collectorName: 'Jane Nakato',
  formCompletedAt: '2026-03-15T10:00:00',
  syncedAt: '2026-03-15T10:05:00',
  status: 'SYNCED',
  financialYearPeriod: 'JAN_JUN_2026',
};

function createUserAdmin(getCollectorSubmissions = vi.fn().mockResolvedValue({
  items: [sampleSubmission],
  totalElements: 1,
  page: 0,
  size: 25,
  totalPages: 1,
})): IUserRepositoryPort {
  return {
    fetchActiveCollectors: vi.fn(),
    createDataCollector: vi.fn(),
    deactivateUser: vi.fn(),
    reactivateUser: vi.fn(),
    resetPassword: vi.fn(),
    getCollectorSubmissions,
  };
}

function createDashboardApi(): IDashboardApiPort {
  return {
    fetchFilterOptions: vi.fn().mockResolvedValue({
      districts: [{ id: KAMPALA_DISTRICT_ID, name: 'Kampala' }],
      subcounties: [],
      parishes: [],
      formTypes: ['BYP'],
      genders: [],
      ageGroups: [],
      collectors: [],
      financialYearPeriods: ['JAN_JUN_2026'],
    }),
    buildFilterQueryString: vi.fn(),
    fetchAggregates: vi.fn(),
  };
}

function renderProfile(userAdmin: IUserRepositoryPort, dashboardApi = createDashboardApi()) {
  return render(
    <MemoryRouter initialEntries={['/admin/users/collector-1?formType=BYP']}>
      <Routes>
        <Route
          path="/admin/users/:id"
          element={<CollectorProfilePage userAdmin={userAdmin} dashboardApi={dashboardApi} collectorName="Jane Nakato" />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('CollectorProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists submissions with filter controls (TC-DASH-06-03)', async () => {
    const getCollectorSubmissions = vi.fn().mockResolvedValue({
      items: [sampleSubmission],
      totalElements: 1,
      page: 0,
      size: 25,
      totalPages: 1,
    });
    renderProfile(createUserAdmin(getCollectorSubmissions));

    expect(screen.getByTestId('collector-profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('collector-profile-filters')).toBeInTheDocument();
    expect(screen.getByTestId('collector-profile-form-type')).toBeInTheDocument();
    expect(screen.getByTestId('collector-profile-district')).toBeInTheDocument();
    expect(screen.getByTestId('collector-profile-date-from')).toBeInTheDocument();
    expect(screen.getByTestId('collector-profile-fy-period')).toBeInTheDocument();

    await waitFor(() => {
      expect(getCollectorSubmissions).toHaveBeenCalledWith(
        'collector-1',
        expect.objectContaining({ formType: 'BYP' }),
        0
      );
      expect(screen.getByTestId('collector-submission-row-submission-1')).toBeInTheDocument();
    });
  });

  it('reloads submissions when a filter changes', async () => {
    const user = userEvent.setup();
    const getCollectorSubmissions = vi.fn().mockResolvedValue({
      items: [],
      totalElements: 0,
      page: 0,
      size: 25,
      totalPages: 0,
    });
    renderProfile(createUserAdmin(getCollectorSubmissions));

    await waitFor(() => {
      expect(getCollectorSubmissions).toHaveBeenCalled();
    });

    await user.selectOptions(screen.getByTestId('collector-profile-district'), KAMPALA_DISTRICT_ID);

    await waitFor(() => {
      expect(getCollectorSubmissions).toHaveBeenCalledWith(
        'collector-1',
        expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID }),
        0
      );
    });
  });
});
