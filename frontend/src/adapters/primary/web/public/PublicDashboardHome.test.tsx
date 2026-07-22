import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicDashboardHome } from './PublicDashboardHome';

describe('PublicDashboardHome', () => {
  it('renders placeholder regions for filters, summary cards, and charts', () => {
    render(<PublicDashboardHome />);

    expect(screen.getByTestId('public-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filters')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-charts')).toBeInTheDocument();
  });
});
