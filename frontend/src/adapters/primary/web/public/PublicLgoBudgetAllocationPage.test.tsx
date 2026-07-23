import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PublicLgoBudgetAllocationPage } from './PublicLgoBudgetAllocationPage';

vi.mock('./LgoBudgetAllocationDashboardFilterPanel', () => ({
  LgoBudgetAllocationDashboardFilterPanel: () => (
    <div data-testid="lgo-budget-allocation-dashboard-filter-panel" />
  ),
}));

vi.mock('./LgoBudgetAllocationSummaryCards', () => ({
  LgoBudgetAllocationSummaryCards: () => <div data-testid="lgo-budget-allocation-summary-cards" />,
}));

vi.mock('./LgoBudgetAllocationCharts', () => ({
  LgoBudgetAllocationCharts: () => <div data-testid="lgo-budget-allocation-charts-section" />,
}));

vi.mock('./LgoBudgetAllocationExportToolbar', () => ({
  LgoBudgetAllocationExportToolbar: () => <div data-testid="lgo-budget-allocation-export-toolbar" />,
}));

describe('PublicLgoBudgetAllocationPage', () => {
  it('renders filter panel, summary, and charts region (TC-LGOB-02-01)', () => {
    render(
      <MemoryRouter>
        <PublicLgoBudgetAllocationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-lgo-budget-allocation-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-charts-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-export-toolbar')).toBeInTheDocument();
  });
});
