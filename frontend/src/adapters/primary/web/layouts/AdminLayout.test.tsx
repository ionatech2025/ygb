import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminLayout } from './AdminLayout';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

function renderAdminLayout(initialPath = '/admin/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<div>Dashboard page</div>} />
          <Route path="/admin/users" element={<div>Users page</div>} />
          <Route path="/admin/collectors" element={<div>Collectors page</div>} />
          <Route path="/admin/sync-status" element={<div>Sync page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: { id: '1', fullName: 'Admin User', phoneNumber: '0771000000', role: 'ADMIN' },
        logout: vi.fn(),
      } as unknown as ReturnType<typeof useAuthStore.getState>)
    );
  });

  it('renders all primary admin navigation sections', () => {
    renderAdminLayout();

    expect(screen.getAllByRole('link', { name: 'Dashboard' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Users' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Collector Tracker' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Sync Status' }).length).toBeGreaterThan(0);
  });

  it('renders the active route outlet', () => {
    renderAdminLayout('/admin/users');
    expect(screen.getByText('Users page')).toBeInTheDocument();
  });

  it('hydrates dashboard filter state from URL search params', async () => {
    renderAdminLayout('/admin/dashboard?districtId=d1&formType=BYP');

    await waitFor(() => {
      expect(useDashboardFilterStore.getState().filter.districtId).toBe('d1');
      expect(useDashboardFilterStore.getState().filter.formType).toBe('BYP');
    });
  });
});
