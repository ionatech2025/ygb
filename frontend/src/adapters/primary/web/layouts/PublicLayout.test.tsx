import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PublicLayout } from './PublicLayout';
import { BudgetPrioritiesIndexPage } from '../budget-priorities/BudgetPrioritiesIndexPage';
import { PublicBudgetPrioritiesPage } from '../public/PublicBudgetPrioritiesPage';

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

function renderPublicLayout(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
          <Route path="/dashboard/budget-priorities" element={<PublicBudgetPrioritiesPage />} />
          <Route path="/budget-priorities" element={<BudgetPrioritiesIndexPage />} />
          <Route path="/resources" element={<div>Resources page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('PublicLayout', () => {
  it('renders Dashboard, Budget Priorities, and Resources links without auth context', () => {
    renderPublicLayout();

    expect(screen.getByRole('navigation', { name: 'Public sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveAttribute(
      'href',
      '/budget-priorities'
    );
    expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: 'Staff sign in' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  it('marks Budget Priorities nav active on index and dashboard routes', () => {
    const { unmount } = renderPublicLayout('/budget-priorities');
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveClass('bg-surface');
    unmount();

    renderPublicLayout('/dashboard/budget-priorities');
    expect(screen.getByRole('link', { name: 'Budget Priorities' })).toHaveClass('bg-surface');
  });

  it('renders the active route outlet', () => {
    renderPublicLayout('/resources');
    expect(screen.getByText('Resources page')).toBeInTheDocument();
  });

  it('opens mobile navigation menu on small screens', async () => {
    const user = userEvent.setup();
    renderPublicLayout();

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(screen.queryByTestId('public-mobile-nav')).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByTestId('public-mobile-nav')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    const mobileNav = screen.getByTestId('public-mobile-nav');
    expect(within(mobileNav).getByRole('link', { name: 'Staff sign in' })).toHaveAttribute('href', '/login');
    expect(within(mobileNav).getByRole('link', { name: 'Budget Priorities' })).toBeInTheDocument();
  });

  it('includes YGB attribution in a content-width footer', () => {
    renderPublicLayout();
    expect(screen.getByText(/Youth Go Budget App \(YGB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Youth Go Budget App \(YGB\)/i).parentElement).toHaveClass('max-w-md');
  });
});
