import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BudgetPrioritySuccessPage } from './BudgetPrioritySuccessPage';
import { BudgetPrioritiesIndexPage } from './BudgetPrioritiesIndexPage';

function renderSuccessPage(
  initialPath: string,
  state?: { result: { bpId: string; status: string; section: string; financialYearPeriod: string } }
) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
      <Routes>
        <Route path="/budget-priorities" element={<BudgetPrioritiesIndexPage />} />
        <Route path="/budget-priorities/:section/success" element={<BudgetPrioritySuccessPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BudgetPrioritySuccessPage', () => {
  it('redirects to the index when success state is missing', () => {
    renderSuccessPage('/budget-priorities/health/success');

    expect(screen.getByTestId('budget-priorities-index')).toBeInTheDocument();
    expect(screen.queryByTestId('budget-priority-success-page')).not.toBeInTheDocument();
  });

  it('shows submitted section and FY period summary', () => {
    renderSuccessPage('/budget-priorities/health/success', {
      result: {
        bpId: 'bp-1',
        status: 'SUBMITTED',
        section: 'health',
        financialYearPeriod: 'JAN_JUN_2026',
      },
    });

    expect(screen.getByTestId('budget-priority-success-page')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Health Sector/i)).toBeInTheDocument();
    expect(screen.getByText(/Jan–Jun 2026/i)).toBeInTheDocument();
  });

  it('lists other sectors as links (TC-BP-01-03)', () => {
    renderSuccessPage('/budget-priorities/health/success', {
      result: {
        bpId: 'bp-1',
        status: 'SUBMITTED',
        section: 'health',
        financialYearPeriod: 'JAN_JUN_2026',
      },
    });

    expect(screen.getByTestId('budget-priority-success-link-agriculture')).toHaveTextContent(
      /Submit Agriculture priorities/i
    );
    expect(screen.getByTestId('budget-priority-success-link-education')).toHaveTextContent(
      /Submit Education priorities/i
    );
    expect(screen.getByTestId('budget-priority-success-link-climate')).toHaveTextContent(
      /Submit Climate priorities/i
    );
    expect(screen.queryByTestId('budget-priority-success-link-health')).not.toBeInTheDocument();
  });
});
