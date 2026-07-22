import { useMemo } from 'react';
import { BarChart3, LayoutDashboard } from 'lucide-react';
import { HttpDashboardAdapter } from '../../../secondary/api/dashboard-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { DashboardFilterPanel } from './DashboardFilterPanel';
import { DashboardSummaryCards } from './DashboardSummaryCards';

export function AdminDashboardHome() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const dashboardApi = useMemo(() => new HttpDashboardAdapter(getAccessToken), [getAccessToken]);

  return (
    <div className="mx-auto max-w-6xl space-y-6" data-testid="admin-dashboard-home">
      <DashboardFilterPanel dashboardApi={dashboardApi} />
      <DashboardSummaryCards dashboardApi={dashboardApi} />

      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <LayoutDashboard className="h-5 w-5 text-brand" aria-hidden="true" />
          Dashboard Overview
        </h2>
        <p className="text-sm text-text-muted">Charts will appear here (issue 004).</p>
      </div>

      <section aria-label="Chart placeholders" data-testid="admin-chart-placeholders">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-muted">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
          Charts
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-muted">
            Submissions over time
          </div>
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-text-muted">
            Breakdown by district / form type
          </div>
        </div>
      </section>
    </div>
  );
}
