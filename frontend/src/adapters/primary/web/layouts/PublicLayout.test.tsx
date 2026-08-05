import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicLayout } from './PublicLayout';
import { BudgetPrioritiesIndexPage } from '../budget-priorities/BudgetPrioritiesIndexPage';
import { PublicBudgetPrioritiesPage } from '../public/PublicBudgetPrioritiesPage';
import { PublicLgoBudgetAllocationPage } from '../public/PublicLgoBudgetAllocationPage';
import type { IPublicVisitBeaconApiPort } from '../../../../ports/public-visit-beacon-api.port';
import { clearPublicVisitBeaconState } from '../../../secondary/storage/public-visit-session.store';

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('../public/BudgetPriorityDashboardFilterPanel', () => ({
  BudgetPriorityDashboardFilterPanel: () => <div data-testid="budget-priority-dashboard-filter-panel" />,
}));

vi.mock('../public/BudgetPrioritySummaryCards', () => ({
  BudgetPrioritySummaryCards: () => <div data-testid="budget-priority-summary-cards" />,
}));

vi.mock('../public/BudgetPriorityCharts', () => ({
  BudgetPriorityCharts: () => <div data-testid="budget-priority-charts-section" />,
}));

vi.mock('../public/BudgetPriorityExportToolbar', () => ({
  BudgetPriorityExportToolbar: () => <div data-testid="budget-priority-export-toolbar" />,
}));

vi.mock('../public/LgoBudgetAllocationDashboardFilterPanel', () => ({
  LgoBudgetAllocationDashboardFilterPanel: () => <div data-testid="lgo-budget-allocation-dashboard-filter-panel" />,
}));

vi.mock('../public/LgoBudgetAllocationSummaryCards', () => ({
  LgoBudgetAllocationSummaryCards: () => <div data-testid="lgo-budget-allocation-summary-cards" />,
}));

vi.mock('../public/LgoBudgetAllocationCharts', () => ({
  LgoBudgetAllocationCharts: () => <div data-testid="lgo-budget-allocation-charts-section" />,
}));

vi.mock('../public/LgoBudgetAllocationExportToolbar', () => ({
  LgoBudgetAllocationExportToolbar: () => <div data-testid="lgo-budget-allocation-export-toolbar" />,
}));

function renderPublicLayout(
  initialPath = '/dashboard',
  visitBeaconApi?: IPublicVisitBeaconApiPort
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PublicLayout visitBeaconApi={visitBeaconApi} />}>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
          <Route path="/dashboard/budget-priorities" element={<PublicBudgetPrioritiesPage />} />
          <Route path="/dashboard/lgo-budget-allocation" element={<PublicLgoBudgetAllocationPage />} />
          <Route path="/budget-priorities" element={<BudgetPrioritiesIndexPage />} />
          <Route path="/resources" element={<div>Resources page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('PublicLayout', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearPublicVisitBeaconState();
    vi.clearAllMocks();
  });

  it('sends a visit beacon when the public dashboard mounts', async () => {
    const recordVisit = vi.fn().mockResolvedValue(undefined);
    renderPublicLayout('/dashboard', { recordVisit });

    await waitFor(() => {
      expect(recordVisit).toHaveBeenCalledWith(
        expect.objectContaining({ routeGroup: 'public-dashboard' })
      );
    });
  });

  it('shows a short anonymous visit privacy notice in the footer', () => {
    renderPublicLayout('/dashboard', { recordVisit: vi.fn().mockResolvedValue(undefined) });
    expect(screen.getByTestId('public-visit-privacy-notice')).toHaveTextContent(/anonymous page views/i);
  });

  it('renders Dashboard, Budget Priorities, LG Budget, and Resources links without auth context', () => {
    renderPublicLayout('/dashboard', { recordVisit: vi.fn().mockResolvedValue(undefined) });

    expect(screen.getByTestId('public-seo-json-ld')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Public sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveAttribute(
      'href',
      '/budget-priorities'
    );
    expect(screen.getByRole('link', { name: 'LG Budget' })).toHaveAttribute(
      'href',
      '/dashboard/lgo-budget-allocation'
    );
    expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: 'Staff sign in' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  it('marks Budget Priorities nav active on index and dashboard routes', () => {
    const api = { recordVisit: vi.fn().mockResolvedValue(undefined) };
    const { unmount } = renderPublicLayout('/budget-priorities', api);
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveClass('bg-surface');
    unmount();

    renderPublicLayout('/dashboard/budget-priorities', api);
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveClass('bg-surface');
  });

  it('marks LG Budget nav active on dashboard route', () => {
    renderPublicLayout('/dashboard/lgo-budget-allocation', {
      recordVisit: vi.fn().mockResolvedValue(undefined),
    });
    expect(screen.getByRole('link', { name: 'LG Budget' })).toHaveClass('bg-surface');
  });

  it('renders the active route outlet', () => {
    renderPublicLayout('/resources', { recordVisit: vi.fn().mockResolvedValue(undefined) });
    expect(screen.getByText('Resources page')).toBeInTheDocument();
  });

  it('opens mobile navigation menu on small screens', async () => {
    const user = userEvent.setup();
    renderPublicLayout('/dashboard', { recordVisit: vi.fn().mockResolvedValue(undefined) });

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(screen.queryByTestId('public-mobile-nav')).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByTestId('public-mobile-nav')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    const mobileNav = screen.getByTestId('public-mobile-nav');
    expect(within(mobileNav).getByRole('link', { name: 'Staff sign in' })).toHaveAttribute('href', '/login');
    expect(within(mobileNav).getByRole('link', { name: 'Budget Priorities' })).toBeInTheDocument();
    expect(within(mobileNav).getByRole('link', { name: 'LG Budget' })).toBeInTheDocument();
  });

  it('includes YGB attribution in a content-width footer', () => {
    renderPublicLayout('/dashboard', { recordVisit: vi.fn().mockResolvedValue(undefined) });
    expect(screen.getByText(/Youth Go Budget App \(YGB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Youth Go Budget App \(YGB\)/i).parentElement).toHaveClass('max-w-md');
  });
});
