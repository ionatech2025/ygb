import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { BudgetPrioritySectionLayout } from './BudgetPrioritySectionLayout';
import { BudgetPrioritiesIndexPage } from './BudgetPrioritiesIndexPage';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

vi.mock('../../../secondary/api/budget-priority-api.adapter', () => ({
  HttpBudgetPriorityAdapter: vi.fn().mockImplementation(() => ({
    submit: vi.fn(),
  })),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

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
    expect(screen.getByTestId('budget-priority-form')).toBeInTheDocument();
  });

  it('redirects invalid section slugs to the index page', () => {
    renderSectionRoute('/budget-priorities/not-a-sector');

    expect(screen.queryByTestId('budget-priority-section-shell')).not.toBeInTheDocument();
    expect(screen.getByTestId('budget-priorities-index')).toBeInTheDocument();
  });

  it.each([
    ['health', 'Health Sector', 'Share your priority areas for health budget allocation.'],
    ['agriculture', 'Agriculture Sector', 'Share your priority areas for agriculture budget allocation.'],
    ['education', 'Education Sector', 'Share your priority areas for education budget allocation.'],
    [
      'climate',
      'Climate Change Mitigation & Adaptation',
      'Share your priority areas for climate-related budget allocation.',
    ],
  ] as const)('renders %s section title and description', (slug, title, description) => {
    renderSectionRoute(`/budget-priorities/${slug}`);

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});
