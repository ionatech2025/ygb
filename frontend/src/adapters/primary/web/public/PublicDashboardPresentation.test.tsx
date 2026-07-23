import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PublicDashboardHome } from './PublicDashboardHome';
import { PublicLayout } from '../layouts/PublicLayout';

vi.mock('./PublicDashboardFilterPanel', () => ({
  PublicDashboardFilterPanel: () => (
    <section aria-label="Dashboard filters" data-testid="public-dashboard-filter-panel">
      <button type="button" className="min-h-11">
        Filters
      </button>
    </section>
  ),
}));

vi.mock('./PublicDashboardExportToolbar', () => ({
  PublicDashboardExportToolbar: () => (
    <div data-testid="public-dashboard-export-toolbar">
      <button type="button" className="min-h-11 min-w-36">
        Download CSV
      </button>
      <button type="button" className="min-h-11 min-w-36">
        Download Excel
      </button>
    </div>
  ),
}));

vi.mock('./PublicDashboardSummaryCards', () => ({
  PublicDashboardSummaryCards: () => (
    <section aria-label="Summary statistics" data-testid="public-dashboard-summary-cards">
      <article data-testid="stat-card-total-submissions">
        <h4>Total submissions</h4>
        <p>1,024</p>
      </article>
    </section>
  ),
}));

vi.mock('./PublicDashboardCharts', () => ({
  PublicDashboardCharts: () => (
    <section data-testid="public-dashboard-charts-section" aria-label="Charts">
      <h2>Charts & geographic view</h2>
      <div data-testid="public-dashboard-charts" aria-label="Dashboard charts">
        <article data-testid="chart-panel-over-time">
          <h3>Submissions over time</h3>
        </article>
      </div>
    </section>
  ),
}));

vi.mock('../../../../core/hooks/usePublicDashboardFilterUrlSync', () => ({
  usePublicDashboardFilterUrlSync: vi.fn(),
}));

function renderPublicDashboardPage() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<PublicDashboardHome />} />
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

describe('PublicDashboardHome presentation (US-PUB-06)', () => {
  it('renders hero, section headings, and dashboard regions', () => {
    render(<PublicDashboardHome />);

    expect(screen.getByTestId('public-dashboard-hero')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Parish Development Model Insights/i })).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filters-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-export-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-export-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('public-dashboard-charts-section')).toBeInTheDocument();
  });

  it('uses presentation section structure for stakeholder demo layout', () => {
    render(<PublicDashboardHome />);

    expect(screen.getByTestId('public-dashboard-hero')).toHaveClass('rounded-3xl');
    expect(screen.getByTestId('public-dashboard-filters-section').querySelector('h2')).toHaveTextContent('Filters');
    expect(screen.getByTestId('public-dashboard-export-section').querySelector('h2')).toHaveTextContent(
      'Export & download'
    );
    expect(screen.getByTestId('public-dashboard-summary-section').querySelector('h2')).toHaveTextContent(
      'Summary statistics'
    );
  });

  it('uses responsive layout classes at desktop and mobile widths (TC-PUB-06-02)', () => {
    const { container } = render(<PublicDashboardHome />);
    const html = container.innerHTML;

    expect(html).toMatch(/xl:max-w-7xl|max-w-6xl/);
    expect(html).toMatch(/sm:px-8|sm:py-10/);
    expect(html).toMatch(/sm:text-3xl|text-2xl/);
  });

  it('passes structural accessibility checks — no unnamed controls (TC-PUB-06-03)', () => {
    renderPublicDashboardPage();

    const buttons = screen.getAllByRole('button');
    for (const button of buttons) {
      expect(accessibleName(button).length).toBeGreaterThan(0);
    }

    const nav = screen.getByRole('navigation', { name: /Public sections/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1.length).toBeGreaterThanOrEqual(1);
  });

  it('ensures interactive controls meet minimum tap target classes (TC-PUB-06-03)', () => {
    renderPublicDashboardPage();

    const menuButton = screen.getByRole('button', { name: /Open menu/i });
    expect(menuButton.className).toMatch(/min-h-11/);
    expect(menuButton.className).toMatch(/min-w-11/);
  });
});
