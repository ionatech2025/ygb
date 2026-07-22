import { BarChart3, Filter, LayoutDashboard } from 'lucide-react';

export function PublicDashboardHome() {
  return (
    <div className="mx-auto max-w-6xl space-y-8" data-testid="public-dashboard-home">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Public Dashboard</p>
        <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold text-text">
          <LayoutDashboard className="h-8 w-8 text-brand" aria-hidden="true" />
          Parish Development Model Insights
        </h1>
        <p className="mt-3 max-w-3xl text-text-muted">
          Explore anonymised programme data across districts, parishes, and enterprise categories. Filters and charts
          will load here in upcoming releases.
        </p>
      </header>

      <section
        aria-label="Dashboard filters"
        data-testid="public-dashboard-filters"
        className="rounded-lg border border-dashed border-border bg-surface p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
          <Filter className="h-5 w-5 text-brand" aria-hidden="true" />
          Filters
        </h2>
        <p className="mt-2 text-sm text-text-muted">Geography, form type, and time period filters — coming soon.</p>
      </section>

      <section
        aria-label="Summary statistics"
        data-testid="public-dashboard-summary"
        className="rounded-lg border border-dashed border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold text-text">Summary</h2>
        <p className="mt-2 text-sm text-text-muted">Key stat cards will appear here.</p>
      </section>

      <section
        aria-label="Dashboard charts"
        data-testid="public-dashboard-charts"
        className="rounded-lg border border-dashed border-border bg-surface p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
          <BarChart3 className="h-5 w-5 text-brand" aria-hidden="true" />
          Charts
        </h2>
        <p className="mt-2 text-sm text-text-muted">Interactive charts and heatmaps — coming soon.</p>
      </section>
    </div>
  );
}
