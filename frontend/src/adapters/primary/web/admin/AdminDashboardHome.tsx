import { useMemo } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { HttpDashboardAdapter } from '../../../secondary/api/dashboard-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { DashboardCharts } from './DashboardCharts';
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
        <p className="text-sm text-text-muted">
          Aggregated submission trends update when filters change.
        </p>
      </div>

      <DashboardCharts dashboardApi={dashboardApi} />
    </div>
  );
}
