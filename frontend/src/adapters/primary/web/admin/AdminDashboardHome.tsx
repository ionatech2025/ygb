import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { HttpDashboardAdapter } from '../../../secondary/api/dashboard-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { applyChartDrillDown, buildSubmissionListSearch } from '../../../../core/domain/dashboard-drill-down.model';
import type { DashboardChartDrillDownEvent } from '../../../../core/domain/dashboard-charts.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { DashboardCharts } from './DashboardCharts';
import { DashboardExportToolbar } from './DashboardExportToolbar';
import { DashboardFilterPanel } from './DashboardFilterPanel';
import { DashboardSummaryCards } from './DashboardSummaryCards';

export function AdminDashboardHome() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const dashboardApi = useMemo(() => new HttpDashboardAdapter(getAccessToken), [getAccessToken]);
  const navigate = useNavigate();
  const filter = useDashboardFilterStore((state) => state.filter);
  const replaceFilter = useDashboardFilterStore((state) => state.replaceFilter);

  const handleDrillDown = (event: DashboardChartDrillDownEvent) => {
    const nextFilter = applyChartDrillDown(filter, event);
    replaceFilter(nextFilter);
    navigate(`/admin/submissions${buildSubmissionListSearch(nextFilter)}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6" data-testid="admin-dashboard-home">
      <DashboardFilterPanel dashboardApi={dashboardApi} />
      <DashboardExportToolbar />
      <DashboardSummaryCards dashboardApi={dashboardApi} />

      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <LayoutDashboard className="h-5 w-5 text-brand" aria-hidden="true" />
          Dashboard Overview
        </h2>
        <p className="text-sm text-text-muted">
          Aggregated submission trends update when filters change. Click a chart segment to drill down.
        </p>
      </div>

      <DashboardCharts dashboardApi={dashboardApi} onDrillDown={handleDrillDown} />
    </div>
  );
}
