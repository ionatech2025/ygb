import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PublicDashboardHome } from './PublicDashboardHome';

vi.mock('./PublicDashboardFilterPanel', () => ({
  PublicDashboardFilterPanel: () => <div data-testid="public-dashboard-filter-panel" />,
}));

describe('PublicDashboardHome', () => {
  it('renders placeholder regions for filters, summary cards, and charts', () => {
    render(<PublicDashboardHome />);

    expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-charts')).toBeInTheDocument();
  });
});
