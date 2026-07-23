import { useMemo } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { HttpPublicDashboardAdapter } from '../../../secondary/api/public-dashboard-api.adapter';
import { PublicDashboardFilterPanel } from './PublicDashboardFilterPanel';
import { PublicDashboardSummaryCards } from './PublicDashboardSummaryCards';
import { PublicDashboardCharts } from './PublicDashboardCharts';

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

      <PublicDashboardCharts dashboardApi={dashboardApi} />
    </div>
  );
}
