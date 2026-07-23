import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BudgetPrioritiesIndexPage } from './BudgetPrioritiesIndexPage';

describe('BudgetPrioritiesIndexPage', () => {
  it('renders four sector cards with correct labels', () => {
    render(
      <MemoryRouter>
        <BudgetPrioritiesIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Budget Priorities' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Health Sector/i })).toHaveAttribute('href', '/budget-priorities/health');
    expect(screen.getByRole('link', { name: /Agriculture Sector/i })).toHaveAttribute(
      'href',
      '/budget-priorities/agriculture'
    );
    expect(screen.getByRole('link', { name: /Education Sector/i })).toHaveAttribute(
      'href',
      '/budget-priorities/education'
    );
    expect(screen.getByRole('link', { name: /Climate Change Mitigation & Adaptation/i })).toHaveAttribute(
      'href',
      '/budget-priorities/climate'
    );
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
  });
});
