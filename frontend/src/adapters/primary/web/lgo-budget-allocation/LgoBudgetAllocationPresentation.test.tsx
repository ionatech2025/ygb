import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LgoBudgetAllocationPage } from '../lgo-budget-allocation/LgoBudgetAllocationPage';
import { PublicLgoBudgetAllocationPage } from '../public/PublicLgoBudgetAllocationPage';
import { PublicLayout } from '../layouts/PublicLayout';

vi.mock('../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    getLoadError: vi.fn().mockReturnValue(null),
  },
}));

vi.mock('../../../../core/lgo-budget-allocation-submit.service', () => ({
  submitLgoBudgetAllocation: vi.fn().mockResolvedValue(1),
}));

vi.mock('../../../secondary/api/lgo-budget-allocation-dashboard-api.adapter', () => ({
  HttpLgoBudgetAllocationDashboardAdapter: vi.fn().mockImplementation(() => ({
    fetchFilterOptions: vi.fn().mockResolvedValue({ genders: [], ageGroups: [], financialYearPeriods: [] }),
    fetchSummary: vi.fn(),
    fetchChart: vi.fn(),
    buildFilterQueryString: vi.fn(),
  })),
}));

vi.mock('../public/LgoBudgetAllocationDashboardFilterPanel', () => ({
  LgoBudgetAllocationDashboardFilterPanel: () => (
    <section aria-label="LGO budget allocation filters" data-testid="lgo-budget-allocation-dashboard-filter-panel">
      <button type="button" className="min-h-11">
        Filters
      </button>
    </section>
  ),
}));

vi.mock('../public/LgoBudgetAllocationExportToolbar', () => ({
  LgoBudgetAllocationExportToolbar: () => (
    <div data-testid="lgo-budget-allocation-export-toolbar">
      <button type="button" className="min-h-11 min-w-36">
        Download CSV
      </button>
    </div>
  ),
}));

vi.mock('../public/LgoBudgetAllocationSummaryCards', () => ({
  LgoBudgetAllocationSummaryCards: () => (
    <section aria-label="LGO budget allocation summary statistics" data-testid="lgo-budget-allocation-summary-cards">
      <article data-testid="stat-card-total-submissions">
        <h4>Total submissions</h4>
        <p>24</p>
      </article>
    </section>
  ),
}));

vi.mock('../public/LgoBudgetAllocationCharts', () => ({
  LgoBudgetAllocationCharts: () => (
    <section data-testid="lgo-budget-allocation-charts-section" aria-label="Allocation charts">
      <h2>Allocation charts</h2>
    </section>
  ),
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

function renderLgoCollectorForm() {
  return render(
    <MemoryRouter>
      <LgoBudgetAllocationPage />
    </MemoryRouter>
  );
}

function renderLgoDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/lgo-budget-allocation']}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/dashboard/lgo-budget-allocation" element={<PublicLgoBudgetAllocationPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function accessibleName(element: HTMLElement): string {
  return (
    element.getAttribute('aria-label') ??
    element.textContent?.trim() ??
    element.getAttribute('title') ??
    ''
  );
}

describe('LGO Budget Allocation presentation (US-LGOB-01 / US-LGOB-02)', () => {
  it('renders collector form hero and themed form panel', () => {
    renderLgoCollectorForm();

    expect(screen.getByTestId('lgo-budget-allocation-page')).toHaveClass('max-w-4xl');
    expect(screen.getByTestId('lgo-budget-allocation-hero')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('lgo-budget-allocation-form-slot')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('lgo-budget-allocation-form-slot')).toHaveClass('overflow-x-hidden');
  });

  it('renders LGO dashboard hero, filters, export, and summary regions', () => {
    render(
      <MemoryRouter>
        <PublicLgoBudgetAllocationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('lgo-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /LGO Budget Allocation Insights/i })).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-dashboard-summary-section')).toBeInTheDocument();
  });

  it('uses responsive layout classes at desktop and mobile widths (TC-PUB-06-02 parity)', () => {
    const { container } = render(
      <MemoryRouter>
        <PublicLgoBudgetAllocationPage />
      </MemoryRouter>
    );
    const html = container.innerHTML;

    expect(html).toMatch(/max-w-5xl/);
    expect(html).toMatch(/sm:p-8/);
    expect(html).toMatch(/sm:text-3xl|text-2xl/);
  });

  it('passes structural accessibility checks on collector form (TC-PUB-06-03 parity)', () => {
    renderLgoCollectorForm();

    expect(screen.getByTestId('lgo-budget-allocation-submit-button')).toHaveClass('min-h-11');
    expect(screen.getByRole('heading', { level: 1, name: 'Budget Allocation Interview' })).toBeInTheDocument();
    expect(screen.getByLabelText(/allocation rationale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget recommendations/i)).toBeInTheDocument();
  });

  it('passes structural accessibility checks on LGO dashboard (TC-PUB-06-03 parity)', () => {
    renderLgoDashboard();

    for (const button of screen.getAllByRole('button')) {
      expect(accessibleName(button).length).toBeGreaterThan(0);
    }

    expect(screen.getByRole('navigation', { name: /Public sections/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /LGO Budget Allocation Insights/i })).toBeInTheDocument();
  });

  it('highlights LGO Budget nav on dashboard route in public layout', () => {
    renderLgoDashboard();

    const navLink = screen.getByRole('link', { name: 'LGO Budget' });
    expect(navLink).toHaveClass('bg-surface');
  });
});
