import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LgoBudgetAllocationPage } from './LgoBudgetAllocationPage';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

vi.mock('../../../../core/lgo-budget-allocation-submit.service', () => ({
  submitLgoBudgetAllocation: vi.fn().mockResolvedValue(1),
}));

vi.mock('../../../secondary/api/lgo-budget-allocation-api.adapter', () => ({
  HttpLgoBudgetAllocationAdapter: vi.fn(),
}));

describe('LgoBudgetAllocationPage', () => {
  it('renders title and intro copy for collectors', () => {
    render(
      <MemoryRouter>
        <LgoBudgetAllocationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('lgo-budget-allocation-page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Budget Allocation Interview' })).toBeInTheDocument();
    expect(
      screen.getByText(/separate from the PDM LGO Questionnaire/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-form-slot')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-budget-allocation-form')).toBeInTheDocument();
  });
});
