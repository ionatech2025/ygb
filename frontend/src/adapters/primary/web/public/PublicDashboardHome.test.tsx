import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PublicDashboardHome } from './PublicDashboardHome';

vi.mock('./PublicDashboardFilterPanel', () => ({
  PublicDashboardFilterPanel: () => <div data-testid="public-dashboard-filter-panel" />,
}));

vi.mock('./PublicDashboardExportToolbar', () => ({
  PublicDashboardExportToolbar: () => <div data-testid="public-dashboard-export-toolbar" />,
}));

vi.mock('./PublicDashboardSummaryCards', () => ({
  PublicDashboardSummaryCards: () => <div data-testid="public-dashboard-summary-cards" />,
}));

vi.mock('./PublicDashboardCharts', () => ({
  PublicDashboardCharts: () => <div data-testid="public-dashboard-charts-section" />,
}));

describe('PublicDashboardHome', () => {
  it('renders hero and section regions for filters, export, summary, and charts', () => {
    render(<PublicDashboardHome />);

    expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-export-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-charts-section')).toBeInTheDocument();
  });
});
