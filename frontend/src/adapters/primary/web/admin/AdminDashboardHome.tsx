import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';
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
    <div className={adminDashboardClasses.page} data-testid="admin-dashboard-home">
      <header className={adminDashboardClasses.hero} data-testid="admin-dashboard-hero">
        <span className={adminDashboardClasses.heroAccent} aria-hidden="true" />
        <span className={adminDashboardClasses.heroGlow} aria-hidden="true" />

        <div
          className={`${adminDashboardClasses.heroContent} flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between`}
        >
          <div className="min-w-0 flex-1">
            <p className={adminDashboardClasses.heroEyebrow}>Admin overview</p>
            <h1 className={`${adminDashboardClasses.heroTitle} flex items-center gap-3`}>
              <LayoutDashboard className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
              Survey Tool Dashboard
            </h1>
            <p className={adminDashboardClasses.heroLead}>
              Monitor submission trends, filter by location and demographics, and export reports for stakeholders.
              Click a chart segment to drill down into matching submissions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border/80 bg-surface-muted/50 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" aria-hidden="true" />
                Role-protected
              </span>
              <span className="inline-flex items-center rounded-full border border-border/80 bg-surface-muted/50 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                <Zap className="mr-1 inline h-3.5 w-3.5 text-nac-orange" aria-hidden="true" />
                Live filters
              </span>
              <span className="inline-flex items-center rounded-full border border-border/80 bg-surface-muted/50 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-nac-blue dark:text-blue-300" aria-hidden="true" />
                CSV, Excel & PDF
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 xl:max-w-sm" data-testid="admin-dashboard-export-section">
            <DashboardExportToolbar layout="inline" />
          </div>
        </div>
      </header>

      <section data-testid="admin-dashboard-filters-section" className={adminDashboardClasses.section}>
        <h2 className={adminDashboardClasses.sectionHeading}>
          <BarChart3 className={adminDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Filter submissions
        </h2>
        <DashboardFilterPanel dashboardApi={dashboardApi} />
      </section>

      <section data-testid="admin-dashboard-summary-section" className={adminDashboardClasses.section}>
        <h2 className={adminDashboardClasses.sectionHeading}>
          <BarChart3 className={adminDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Summary statistics
        </h2>
        <DashboardSummaryCards dashboardApi={dashboardApi} />
      </section>

      <DashboardCharts dashboardApi={dashboardApi} onDrillDown={handleDrillDown} />
    </div>
  );
}
