import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BudgetPrioritySectionLayout } from './BudgetPrioritySectionLayout';
import { BudgetPrioritiesIndexPage } from './BudgetPrioritiesIndexPage';

function renderSectionRoute(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/budget-priorities" element={<BudgetPrioritiesIndexPage />} />
        <Route path="/budget-priorities/:section" element={<BudgetPrioritySectionLayout />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BudgetPrioritySectionLayout', () => {
  it('loads section shell for a valid sector slug', () => {
    renderSectionRoute('/budget-priorities/health');

    expect(screen.getByTestId('budget-priority-section-shell')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Health Sector' })).toBeInTheDocument();
    expect(screen.getByTestId('budget-priority-form-slot')).toBeInTheDocument();
  });

  it('redirects invalid section slugs to the index page', async () => {
    renderSectionRoute('/budget-priorities/not-a-sector');

    expect(screen.queryByTestId('budget-priority-section-shell')).not.toBeInTheDocument();
    expect(screen.getByTestId('budget-priorities-index')).toBeInTheDocument();
  });
});
