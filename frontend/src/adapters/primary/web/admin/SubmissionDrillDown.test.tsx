import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmissionListPage } from './SubmissionListPage';
import { SubmissionDetailPage } from './SubmissionDetailPage';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { ISubmissionAdminApiPort } from '../../../../ports/submission-admin-api.port';

const sampleRow = {
  id: '11111111-1111-1111-1111-111111111111',
  formType: 'BYP' as const,
  respondentName: 'Jane Doe',
  districtId: KAMPALA_DISTRICT_ID,
  districtName: 'Kampala',
  collectorId: '22222222-2222-2222-2222-222222222222',
  collectorName: 'Default Collector',
  formCompletedAt: '2026-03-15T10:00:00',
  syncedAt: '2026-03-15T10:05:00',
  status: 'SYNCED',
  financialYearPeriod: 'JAN_JUN_2026',
};

function createSubmissionApi(
  overrides: Partial<ISubmissionAdminApiPort> = {}
): ISubmissionAdminApiPort {
  return {
    listSubmissions: vi.fn().mockResolvedValue({
      items: [sampleRow],
      totalElements: 1,
      page: 0,
      size: 25,
      totalPages: 1,
    }),
    getSubmissionDetail: vi.fn().mockResolvedValue({
      id: sampleRow.id,
      collectorId: sampleRow.collectorId,
      collectorName: sampleRow.collectorName,
      status: sampleRow.status,
      formCompletedAt: sampleRow.formCompletedAt,
      syncedAt: sampleRow.syncedAt,
      financialYearPeriod: sampleRow.financialYearPeriod,
      payload: {
        formType: 'BYP',
        respondentName: 'Jane Doe',
        respondentPhone: '0772111222',
        respondentGender: 'FEMALE',
        respondentAgeGroup: 'AGE_20_24',
        districtId: KAMPALA_DISTRICT_ID,
        subcountyId: 'subcounty-1',
        parishId: 'parish-1',
        villageId: 'village-1',
        deviceSubmissionId: '33333333-3333-3333-3333-333333333333',
        formCompletedAt: sampleRow.formCompletedAt,
        exactAge: 22,
        improvementSuggestion: 'More support.',
      },
    }),
    ...overrides,
  };
}

vi.mock('../../../secondary/api/submission-admin-api.adapter', () => ({
  HttpSubmissionAdminAdapter: vi.fn(),
}));

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { getAccessToken: () => string }) => unknown) =>
    selector({ getAccessToken: () => 'admin-token' }),
}));

describe('SubmissionListPage', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders submission rows for the active filter', async () => {
    const listSubmissions = vi.fn().mockResolvedValue({
      items: [sampleRow],
      totalElements: 1,
      page: 0,
      size: 25,
      totalPages: 1,
    });
    const { HttpSubmissionAdminAdapter } = await import('../../../secondary/api/submission-admin-api.adapter');
    vi.mocked(HttpSubmissionAdminAdapter).mockImplementation(
      () => createSubmissionApi({ listSubmissions }) as never
    );

    render(
      <MemoryRouter initialEntries={[`/admin/submissions?districtId=${KAMPALA_DISTRICT_ID}`]}>
        <Routes>
          <Route path="/admin/submissions" element={<SubmissionListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('submission-list-table')).toBeInTheDocument();
    });

    expect(listSubmissions).toHaveBeenCalledWith(
      expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID }),
      0
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Kampala')).toBeInTheDocument();
  });

  it('navigates to detail view when a row is clicked', async () => {
    const user = userEvent.setup();
    const { HttpSubmissionAdminAdapter } = await import('../../../secondary/api/submission-admin-api.adapter');
    vi.mocked(HttpSubmissionAdminAdapter).mockImplementation(() => createSubmissionApi() as never);

    render(
      <MemoryRouter initialEntries={[`/admin/submissions?districtId=${KAMPALA_DISTRICT_ID}`]}>
        <Routes>
          <Route path="/admin/submissions" element={<SubmissionListPage />} />
          <Route path="/admin/submissions/:id" element={<SubmissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId(`submission-row-${sampleRow.id}`)).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`submission-row-${sampleRow.id}`));

    await waitFor(() => {
      expect(screen.getByTestId('submission-detail-page')).toBeInTheDocument();
    });
  });

  it('preserves dashboard filters on back navigation link', async () => {
    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' },
      locationFilterError: null,
    });

    const { HttpSubmissionAdminAdapter } = await import('../../../secondary/api/submission-admin-api.adapter');
    vi.mocked(HttpSubmissionAdminAdapter).mockImplementation(() => createSubmissionApi() as never);

    render(
      <MemoryRouter initialEntries={[`/admin/submissions?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE`]}>
        <Routes>
          <Route path="/admin/submissions" element={<SubmissionListPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('submission-list-back-dashboard')).toHaveAttribute(
        'href',
        `/admin/dashboard?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE`
      );
    });
  });
});

describe('SubmissionDetailPage', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders submission detail and preserves filter params on back links', async () => {
    const { HttpSubmissionAdminAdapter } = await import('../../../secondary/api/submission-admin-api.adapter');
    vi.mocked(HttpSubmissionAdminAdapter).mockImplementation(() => createSubmissionApi() as never);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/admin/submissions/${sampleRow.id}`,
            search: `?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE`,
            state: { returnSearch: `?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE` },
          },
        ]}
      >
        <Routes>
          <Route path="/admin/submissions/:id" element={<SubmissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('submission-detail-view')).toBeInTheDocument();
    });

    expect(screen.getByTestId('submission-detail-back-list')).toHaveAttribute(
      'href',
      `/admin/submissions?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE`
    );
    expect(screen.getByTestId('submission-detail-back-dashboard')).toHaveAttribute(
      'href',
      `/admin/dashboard?districtId=${KAMPALA_DISTRICT_ID}&gender=FEMALE`
    );
    expect(screen.getByText('More support.')).toBeInTheDocument();
  });
});
