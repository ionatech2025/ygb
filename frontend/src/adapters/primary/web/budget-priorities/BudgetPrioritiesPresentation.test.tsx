import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BudgetPrioritiesIndexPage } from '../budget-priorities/BudgetPrioritiesIndexPage';
import { BudgetPrioritySectionLayout } from '../budget-priorities/BudgetPrioritySectionLayout';
import { PublicBudgetPrioritiesPage } from '../public/PublicBudgetPrioritiesPage';
import { PublicLayout } from '../layouts/PublicLayout';

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

vi.mock('./BudgetPriorityDashboardFilterPanel', () => ({
  BudgetPriorityDashboardFilterPanel: () => (
    <section aria-label="Budget priority filters" data-testid="budget-priority-dashboard-filter-panel">
      <button type="button" className="min-h-11">
        Filters
      </button>
    </section>
  ),
}));

vi.mock('./BudgetPriorityExportToolbar', () => ({
  BudgetPriorityExportToolbar: () => (
    <div data-testid="budget-priority-export-toolbar">
      <button type="button" className="min-h-11 min-w-36">
        Download CSV
      </button>
      <button type="button" className="min-h-11 min-w-36">
        Download Excel
      </button>
    </div>
  ),
}));

vi.mock('./BudgetPrioritySummaryCards', () => ({
  BudgetPrioritySummaryCards: () => (
    <section aria-label="Summary statistics" data-testid="budget-priority-summary-cards">
      <article data-testid="stat-card-total-submissions">
        <h4>Total submissions</h4>
        <p>512</p>
      </article>
    </section>
  ),
}));

vi.mock('./BudgetPriorityCharts', () => ({
  BudgetPriorityCharts: () => (
    <section data-testid="budget-priority-charts-section" aria-label="Charts">
      <h2>Charts</h2>
    </section>
  ),
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

function renderBudgetPrioritiesIndex() {
  return render(
    <MemoryRouter initialEntries={['/budget-priorities']}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/budget-priorities" element={<BudgetPrioritiesIndexPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function renderBudgetPriorityForm() {
  return render(
    <MemoryRouter initialEntries={['/budget-priorities/health']}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/budget-priorities/:section" element={<BudgetPrioritySectionLayout />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function renderBudgetPrioritiesDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/budget-priorities']}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/dashboard/budget-priorities" element={<PublicBudgetPrioritiesPage />} />
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

describe('Budget Priorities presentation (US-BP-01 / US-BP-02)', () => {
  it('renders index hero, sector cards, and dashboard promo with theme classes', () => {
    render(
      <MemoryRouter>
        <BudgetPrioritiesIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('budget-priorities-index')).toHaveClass('max-w-4xl');
    expect(screen.getByTestId('budget-priorities-hero')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('budget-priority-sector-health')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('budget-priorities-dashboard-link')).toHaveClass('rounded-2xl');
  });

  it('renders section form shell with themed form panel', () => {
    render(
      <MemoryRouter initialEntries={['/budget-priorities/health']}>
        <Routes>
          <Route path="/budget-priorities/:section" element={<BudgetPrioritySectionLayout />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('budget-priority-form-slot')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('budget-priority-form-slot')).toHaveClass('overflow-x-hidden');
    expect(screen.getByTestId('budget-priority-submit-button')).toHaveClass('min-h-11');
  });

  it('renders BP dashboard hero, filters, export, and summary regions', () => {
    render(
      <MemoryRouter>
        <PublicBudgetPrioritiesPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('bp-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Budget Priorities Insights/i })).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('bp-dashboard-summary-section')).toBeInTheDocument();
  });

  it('uses responsive layout classes at desktop and mobile widths (TC-PUB-06-02 parity)', () => {
    const { container } = render(
      <MemoryRouter>
        <PublicBudgetPrioritiesPage />
      </MemoryRouter>
    );
    const html = container.innerHTML;

    expect(html).toMatch(/max-w-5xl/);
    expect(html).toMatch(/sm:p-8/);
    expect(html).toMatch(/sm:text-3xl|text-2xl/);
  });

  it('passes structural accessibility checks on BP index (TC-PUB-06-03 parity)', () => {
    renderBudgetPrioritiesIndex();

    for (const button of screen.getAllByRole('button')) {
      expect(accessibleName(button).length).toBeGreaterThan(0);
    }

    expect(screen.getByRole('navigation', { name: /Public sections/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Budget Priorities' })).toBeInTheDocument();
  });

  it('passes structural accessibility checks on BP form shell (TC-PUB-06-03 parity)', () => {
    renderBudgetPriorityForm();

    expect(screen.getByTestId('budget-priority-submit-button')).toHaveClass('min-h-11');
    expect(screen.getByRole('heading', { level: 1, name: 'Health Sector' })).toBeInTheDocument();
  });

  it('passes structural accessibility checks on BP dashboard (TC-PUB-06-03 parity)', () => {
    renderBudgetPrioritiesDashboard();

    for (const button of screen.getAllByRole('button')) {
      expect(accessibleName(button).length).toBeGreaterThan(0);
    }

    expect(screen.getByRole('heading', { level: 1, name: /Budget Priorities Insights/i })).toBeInTheDocument();
  });

  it('highlights Budget Priorities nav on dashboard route in public layout', () => {
    renderBudgetPrioritiesDashboard();

    const navLinks = screen.getAllByRole('link', { name: 'Budget Priorities' });
    expect(navLinks.some((link) => link.className.includes('bg-surface'))).toBe(true);
  });
});
