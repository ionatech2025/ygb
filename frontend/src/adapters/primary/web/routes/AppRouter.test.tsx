import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRouter } from './AppRouter';
import { useAuthStore } from '../../../../core/store/useAuthStore';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../../../core/store/useSyncStore', () => {
  const state = {
    initialize: vi.fn(),
    triggerSync: vi.fn(),
    pendingCount: 0,
    lastSyncedAt: null,
    syncing: false,
  };
  return {
    useSyncStore: Object.assign((selector: (value: typeof state) => unknown) => selector(state), {
      getState: () => state,
    }),
  };
});

vi.mock('../../../../core/store/useSubmissionCountStore', () => {
  const state = {
    initialize: vi.fn(),
    reconcileWithServer: vi.fn(),
    refreshFromLocal: vi.fn(),
    ensureCurrentDay: vi.fn(),
    todayCount: 0,
  };
  return {
    useSubmissionCountStore: Object.assign((selector: (value: typeof state) => unknown) => selector(state), {
      getState: () => state,
    }),
  };
});

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

vi.mock('../../../secondary/api/budget-priority-dashboard-api.adapter', () => ({
  HttpBudgetPriorityDashboardAdapter: vi.fn().mockImplementation(() => ({
    buildFilterQueryString: vi.fn().mockReturnValue(''),
    fetchFilterOptions: vi.fn().mockResolvedValue({
      sections: ['health'],
      genders: [],
      ageGroups: [],
      financialYearPeriods: [],
    }),
    fetchSummary: vi.fn().mockResolvedValue({
      totalSubmissions: 0,
      bySection: [],
      topPriorityAreas: [],
    }),
    fetchChart: vi.fn().mockResolvedValue({ chartType: 'by-sector', data: [] }),
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

const collectorUser = {
  id: '22222222-2222-2222-2222-222222222222',
  fullName: 'Field Collector',
  phoneNumber: '0771111111',
  role: 'DATA_COLLECTOR' as const,
};

describe('AppRouter public dashboard routes', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
      isOnline: true,
    });
  });

  it('loads /dashboard without redirecting to login', async () => {
    window.history.pushState({}, '', '/dashboard');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('renders public nav with Dashboard, Budget Priorities, and Resources links', async () => {
    window.history.pushState({}, '', '/dashboard');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
      expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveAttribute(
        'href',
        '/budget-priorities'
      );
      expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
      expect(screen.queryByRole('link', { name: 'LGO Budget Allocation' })).not.toBeInTheDocument();
    });
  });

  it('allows ADMIN sessions to access public dashboard pages', async () => {
    useAuthStore.setState({
      user: adminUser,
      tokens: adminTokens,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
    });

    window.history.pushState({}, '', '/resources');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'PDM Information & Resources' })).toBeInTheDocument();
    });
  });

  it('allows DATA_COLLECTOR sessions to access public dashboard pages', async () => {
    useAuthStore.setState({
      user: collectorUser,
      tokens: adminTokens,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
    });

    window.history.pushState({}, '', '/dashboard');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    });
  });
});

describe('AppRouter budget priorities routes', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
      isOnline: true,
    });
  });

  it('loads /budget-priorities without redirecting to login', async () => {
    window.history.pushState({}, '', '/budget-priorities');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('budget-priorities-index')).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/budget-priorities');
  });

  it('loads /budget-priorities/health section shell without authentication', async () => {
    window.history.pushState({}, '', '/budget-priorities/health');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('budget-priority-section-shell')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Health Sector' })).toBeInTheDocument();
    });
  });

  it('redirects invalid budget priority section slugs to the index', async () => {
    window.history.pushState({}, '', '/budget-priorities/unknown-sector');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('budget-priorities-index')).toBeInTheDocument();
    });
  });

  it('loads /dashboard/budget-priorities without redirecting to login', async () => {
    window.history.pushState({}, '', '/dashboard/budget-priorities');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('public-budget-priorities-dashboard')).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/dashboard/budget-priorities');
  });
});

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
      expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
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

  it('loads budget allocations resource route', async () => {
    window.history.pushState({}, '', '/resources/budget-allocations');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'All resources' })).toBeInTheDocument();
    });
  });

  it('loads priorities resource route', async () => {
    window.history.pushState({}, '', '/resources/priorities');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'All resources' })).toBeInTheDocument();
    });
  });
});

describe('AppRouter collector LGO budget allocation routes', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
      isOnline: true,
    });
  });

  it('redirects unauthenticated visitors from /collector/lgo-budget-allocation to login (TC-LGOB-01-01)', async () => {
    window.history.pushState({}, '', '/collector/lgo-budget-allocation');
    render(<AppRouter />);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    });
    expect(screen.queryByTestId('lgo-budget-allocation-page')).not.toBeInTheDocument();
  });

  it('loads the page shell for authenticated DATA_COLLECTOR sessions', async () => {
    useAuthStore.setState({
      user: collectorUser,
      tokens: adminTokens,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
      getAccessToken: () => adminTokens.accessToken,
    });

    window.history.pushState({}, '', '/collector/lgo-budget-allocation');
    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('lgo-budget-allocation-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Budget Allocation Interview' })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/collector/lgo-budget-allocation');
  });

  it('redirects ADMIN users away from collector-only LGO budget allocation route', async () => {
    useAuthStore.setState({
      user: adminUser,
      tokens: adminTokens,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
    });

    window.history.pushState({}, '', '/collector/lgo-budget-allocation');
    render(<AppRouter />);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin/dashboard');
      expect(screen.getByTestId('admin-dashboard-home')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('lgo-budget-allocation-page')).not.toBeInTheDocument();
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
