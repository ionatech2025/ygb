import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRouter } from './AppRouter';
import { useAuthStore } from '../../../../core/store/useAuthStore';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../../../core/store/useSyncStore', () => ({
  useSyncStore: Object.assign(vi.fn(), {
    getState: () => ({
      initialize: vi.fn(),
      triggerSync: vi.fn(),
    }),
  }),
}));

vi.mock('../../../../core/store/useSubmissionCountStore', () => ({
  useSubmissionCountStore: Object.assign(vi.fn(), {
    getState: () => ({
      initialize: vi.fn(),
      reconcileWithServer: vi.fn(),
    }),
  }),
}));

vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

vi.mock('../../../secondary/api/submission-export-api.adapter', () => ({
  HttpSubmissionExportAdapter: vi.fn().mockImplementation(() => ({
    downloadExport: vi.fn().mockResolvedValue(undefined),
  })),
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
      byDistrict: [],
      byGender: [],
      overTime: [],
      byFormType: [],
      byFinancialYearPeriod: [],
    }),
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

vi.mock('../../../secondary/api/http-user.adapter', () => ({
  HttpUserAdapter: vi.fn().mockImplementation(() => ({
    fetchActiveCollectors: vi.fn().mockResolvedValue([]),
    createDataCollector: vi.fn(),
    deactivateUser: vi.fn(),
    reactivateUser: vi.fn(),
    resetPassword: vi.fn(),
    getCollectorSubmissions: vi.fn().mockResolvedValue({
      items: [],
      totalElements: 0,
      page: 0,
      size: 25,
      totalPages: 0,
    }),
  })),
}));

const adminUser = {
  id: '11111111-1111-1111-1111-111111111111',
  fullName: 'Administrator',
  phoneNumber: '0770000000',
  role: 'ADMIN' as const,
};

const adminTokens = {
  accessToken: 'test-token',
  refreshToken: 'refresh-token',
  issuedAt: Date.now(),
  expiresAt: Date.now() + 3_600_000,
};

describe('AppRouter public resource routes', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
      isOnline: true,
    });
  });

  it('loads the resources index without authentication', async () => {
    window.history.pushState({}, '', '/resources');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'PDM Information & Resources' })).toBeInTheDocument();
    });
  });

  it('loads programme overview detail without authentication', async () => {
    window.history.pushState({}, '', '/resources/programme-overview');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Programme Overview' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'About the Parish Development Model (PDM)' })).toBeInTheDocument();
    });
  });

  it('loads all configured resource routes', async () => {
    const routes = ['/resources/budget-allocations', '/resources/priorities'];

    for (const route of routes) {
      window.history.pushState({}, '', route);
      const { unmount } = render(<AppRouter />);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: '← All resources' })).toBeInTheDocument();
      });

      unmount();
    }
  });
});

describe('AppRouter admin routes', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/admin/users');
    useAuthStore.setState({
      user: adminUser,
      tokens: adminTokens,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
    });
  });

  afterEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.setState({ isInitialized: true });
  });

  it('renders ManageUsers at /admin/users', async () => {
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByText('Data Collector Management')).toBeInTheDocument();
    });
  });

  it('renders dashboard home placeholders at /admin/dashboard', async () => {
    window.history.pushState({}, '', '/admin/dashboard');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('admin-dashboard-home')).toBeInTheDocument();
    });
  });
});
