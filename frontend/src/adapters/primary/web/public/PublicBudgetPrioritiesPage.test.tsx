import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PublicBudgetPrioritiesPage } from './PublicBudgetPrioritiesPage';

vi.mock('./BudgetPriorityDashboardFilterPanel', () => ({
  BudgetPriorityDashboardFilterPanel: () => <div data-testid="budget-priority-dashboard-filter-panel" />,
}));

vi.mock('./BudgetPrioritySummaryCards', () => ({
  BudgetPrioritySummaryCards: () => <div data-testid="budget-priority-summary-cards" />,
}));

vi.mock('./BudgetPriorityCharts', () => ({
  BudgetPriorityCharts: () => <div data-testid="budget-priority-charts-section" />,
}));

describe('PublicBudgetPrioritiesPage', () => {
  it('renders sector selector region and summary section (TC-BP-02-01)', () => {
    render(
      <MemoryRouter>
        <PublicBudgetPrioritiesPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-budget-priorities-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('budget-priority-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('budget-priority-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('budget-priority-charts-section')).toBeInTheDocument();
  });
});
