import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LgoBudgetAllocationPage } from './LgoBudgetAllocationPage';

describe('LgoBudgetAllocationPage', () => {
  it('renders title and intro copy for collectors', () => {
    render(
      <MemoryRouter>
        <LgoBudgetAllocationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('lgo-budget-allocation-page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Budget Allocation Interview' })).toBeInTheDocument();
    expect(screen.getByText(/previous financial year/i)).toBeInTheDocument();
    expect(screen.getByText(/separate from the PDM LGO Questionnaire/i)).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-form-slot')).toBeInTheDocument();
  });
});
