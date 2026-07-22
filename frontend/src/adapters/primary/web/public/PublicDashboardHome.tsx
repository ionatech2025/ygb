import { useMemo } from 'react';
import { BarChart3, LayoutDashboard } from 'lucide-react';
import { HttpPublicDashboardAdapter } from '../../../secondary/api/public-dashboard-api.adapter';
import { PublicDashboardFilterPanel } from './PublicDashboardFilterPanel';
import { PublicDashboardSummaryCards } from './PublicDashboardSummaryCards';

export function PublicDashboardHome() {
  const dashboardApi = useMemo(() => new HttpPublicDashboardAdapter(), []);

  return (
    <div className="mx-auto max-w-6xl space-y-8" data-testid="public-dashboard-home">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Public Dashboard</p>
        <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold text-text">
          <LayoutDashboard className="h-8 w-8 text-brand" aria-hidden="true" />
          Parish Development Model Insights
        </h1>
        <p className="mt-3 max-w-3xl text-text-muted">
          Explore anonymised programme data across districts, parishes, and enterprise categories. Adjust filters to
          refine summary statistics and charts.
        </p>
      </header>

      <PublicDashboardFilterPanel dashboardApi={dashboardApi} />

      <PublicDashboardSummaryCards dashboardApi={dashboardApi} />

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
