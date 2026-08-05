import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  DownloadUsageAggregates,
  DownloaderPage,
  VisitsVsDownloadsComparison,
} from '../../../../core/domain/download-usage-analytics.model';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { IAdminDownloadUsageAnalyticsApiPort } from '../../../../ports/admin-download-usage-analytics-api.port';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AdminDownloadUsagePage } from './AdminDownloadUsagePage';

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
  EChart: ({ testId, ariaLabel }: { testId?: string; ariaLabel?: string }) => (
    <div data-testid={testId} aria-label={ariaLabel} />
  ),
}));

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

function mockAdminAuth() {
  vi.mocked(useAuthStore).mockImplementation((selector) =>
    selector({
      isInitialized: true,
      isAuthenticated: true,
      user: { id: '1', fullName: 'Admin', phoneNumber: '0771000000', role: 'ADMIN' },
      getAccessToken: () => 'admin-token',
    } as ReturnType<typeof useAuthStore.getState>)
  );
}

function mockCollectorAuth() {
  vi.mocked(useAuthStore).mockImplementation((selector) =>
    selector({
      isInitialized: true,
      isAuthenticated: true,
      user: { id: '2', fullName: 'Collector', phoneNumber: '0772000000', role: 'DATA_COLLECTOR' },
      getAccessToken: () => 'collector-token',
    } as ReturnType<typeof useAuthStore.getState>)
  );
}

function createAggregates(): DownloadUsageAggregates {
  return {
    totalDownloaders: 2,
    totalDownloads: 5,
    byGender: [{ gender: 'FEMALE', count: 2 }],
    byAgeGroup: [{ ageGroup: 'AGE_18_24', count: 2 }],
    byDataset: [{ dataset: 'PDM', count: 3 }],
    downloadsOverTime: [{ bucketStart: '2026-08-04', count: 2 }],
  };
}

function createVisits(): VisitsVsDownloadsComparison {
  return {
    totalUniqueVisitors: 12,
    totalUniqueDownloaders: 5,
    overTime: [{ bucketStart: '2026-08-04', visitorCount: 7, downloaderCount: 3 }],
  };
}

function createDownloaderPage(overrides: Partial<DownloaderPage> = {}): DownloaderPage {
  return {
    items: [
      {
        profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: 'analyst@example.com',
        optionalName: 'Ada Lovelace',
        countryCode: 'UG',
        gender: 'FEMALE',
        ageGroup: 'AGE_18_24',
        fieldOfOperation: 'ACADEMIA_RESEARCH',
        fieldOfOperationSpecify: null,
        registeredAt: '2026-08-01T10:00:00',
        downloadCount: 3,
        lastDownloadedAt: '2026-08-04T12:00:00',
      },
    ],
    totalElements: 1,
    page: 0,
    size: 25,
    totalPages: 1,
    ...overrides,
  };
}

function createApi(
  overrides: Partial<IAdminDownloadUsageAnalyticsApiPort> = {}
): IAdminDownloadUsageAnalyticsApiPort {
  return {
    fetchDownloaders: vi.fn().mockResolvedValue(createDownloaderPage()),
    fetchDownloadUsage: vi.fn().mockResolvedValue(createAggregates()),
    fetchVisitsVsDownloads: vi.fn().mockResolvedValue(createVisits()),
    ...overrides,
  };
}

describe('AdminDownloadUsagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminAuth();
  });

  it('shows downloader rows with email and optional name', async () => {
    const api = createApi();
    render(<AdminDownloadUsagePage analyticsApi={api} />);

    await waitFor(() => {
      expect(screen.getByText('analyst@example.com')).toBeInTheDocument();
    });
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total-downloaders')).toHaveTextContent('2');
    expect(screen.getByTestId('visits-vs-downloads-panel')).toBeInTheDocument();
    expect(screen.getByTestId('visits-vs-downloads-chart')).toBeInTheDocument();
  });

  it('refreshes charts and table when age/gender filters change', async () => {
    const user = userEvent.setup();
    const api = createApi();
    render(<AdminDownloadUsagePage analyticsApi={api} />);

    await waitFor(() => expect(api.fetchDownloaders).toHaveBeenCalled());
    expect(await screen.findByTestId('admin-download-usage-page')).toBeInTheDocument();

    await chooseFormOptionByValue(user, /^gender$/i, 'FEMALE');
    await chooseFormOptionByValue(user, /^age group$/i, 'AGE_18_24');

    await waitFor(() => {
      expect(api.fetchDownloaders).toHaveBeenCalledWith(
        { gender: 'FEMALE', ageGroup: 'AGE_18_24' },
        0,
        25
      );
      expect(api.fetchDownloadUsage).toHaveBeenCalledWith({
        gender: 'FEMALE',
        ageGroup: 'AGE_18_24',
      });
      expect(api.fetchVisitsVsDownloads).toHaveBeenCalledWith({
        gender: 'FEMALE',
        ageGroup: 'AGE_18_24',
      });
    });
  });

  it('prevents non-admin access to the download usage route', () => {
    mockCollectorAuth();

    render(
      <MemoryRouter initialEntries={['/admin/download-usage']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route
              path="/admin/download-usage"
              element={<AdminDownloadUsagePage analyticsApi={createApi()} />}
            />
          </Route>
          <Route path="/collector/dashboard" element={<div>Collector home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('admin-download-usage-page')).not.toBeInTheDocument();
    expect(screen.getByText('Collector home')).toBeInTheDocument();
  });
});
