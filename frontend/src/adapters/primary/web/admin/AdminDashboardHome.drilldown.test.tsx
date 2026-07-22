import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDashboardHome } from './AdminDashboardHome';
import { SubmissionListPage } from './SubmissionListPage';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { DashboardAggregates } from '../../../../core/domain/dashboard-aggregates.model';

vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

vi.mock('../components/EChart', () => ({
  EChart: ({
    testId,
    onSegmentClick,
  }: {
    testId: string;
    onSegmentClick?: (params: { dataIndex: number }) => void;
  }) => (
    <button type="button" data-testid={`${testId}-segment`} onClick={() => onSegmentClick?.({ dataIndex: 0 })}>
      segment
    </button>
  ),
}));

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
    fetchAggregates: vi.fn().mockResolvedValue({
      totalSubmissions: 0,
      byDistrict: [{ districtName: 'Kampala', districtId: KAMPALA_DISTRICT_ID, count: 1 }],
      byGender: [],
      overTime: [],
      byFormType: [],
      byFinancialYearPeriod: [],
    } satisfies DashboardAggregates),
  })),
}));

vi.mock('../../../secondary/api/submission-admin-api.adapter', () => ({
  HttpSubmissionAdminAdapter: vi.fn().mockImplementation(() => ({
    listSubmissions: vi.fn().mockResolvedValue({
      items: [],
      totalElements: 0,
      page: 0,
      size: 25,
      totalPages: 0,
    }),
    getSubmissionDetail: vi.fn(),
  })),
}));

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { getAccessToken: () => string }) => unknown) =>
    selector({ getAccessToken: () => 'admin-token' }),
}));

describe('AdminDashboardHome drill-down', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
  });

  it('navigates to the submission list with district filter applied (TC-DASH-04-01)', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
          <Route path="/admin/submissions" element={<SubmissionListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chart-submissions-by-district-segment')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('chart-submissions-by-district-segment'));

    await waitFor(() => {
      expect(screen.getByTestId('submission-list-page')).toBeInTheDocument();
    });

    expect(useDashboardFilterStore.getState().filter.districtId).toBe(KAMPALA_DISTRICT_ID);
  });
});
