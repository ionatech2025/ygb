import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PublicDashboardHome } from './PublicDashboardHome';

vi.mock('./PublicDashboardFilterPanel', () => ({
  PublicDashboardFilterPanel: () => <div data-testid="public-dashboard-filter-panel" />,
}));

vi.mock('./PublicDashboardSummaryCards', () => ({
  PublicDashboardSummaryCards: () => <div data-testid="public-dashboard-summary-cards" />,
}));

vi.mock('./PublicDashboardCharts', () => ({
  PublicDashboardCharts: () => <div data-testid="public-dashboard-charts-section" />,
}));

vi.mock('./PublicDownloadUsageSection', () => ({
  PublicDownloadUsageSection: () => <div data-testid="public-download-usage-section" />,
}));

describe('PublicDashboardHome', () => {
  it('renders hero, filters, download hub CTA, summary, charts, and public download usage', () => {
    render(
      <MemoryRouter>
        <PublicDashboardHome />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-hub-cta')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-hub-cta-link')).toHaveAttribute('href', '/download');
    expect(screen.getByTestId('public-dashboard-summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('public-dashboard-export-toolbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-charts-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-usage-section')).toBeInTheDocument();
  });
});
