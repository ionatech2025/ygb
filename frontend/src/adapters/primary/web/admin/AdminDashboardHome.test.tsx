import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminDashboardHome } from './AdminDashboardHome';

describe('AdminDashboardHome', () => {
  it('renders summary stat and chart placeholder regions', () => {
    render(<AdminDashboardHome />);

    expect(screen.getByTestId('admin-dashboard-home')).toBeInTheDocument();
    expect(screen.getByTestId('admin-stat-placeholders')).toBeInTheDocument();
    expect(screen.getByTestId('admin-chart-placeholders')).toBeInTheDocument();
    expect(screen.getByText('Total submissions')).toBeInTheDocument();
    expect(screen.getByText('Submissions over time')).toBeInTheDocument();
    expect(screen.getByText('Breakdown by district / form type')).toBeInTheDocument();
  });
});
