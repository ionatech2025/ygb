import { useMemo } from 'react';
import { FileDown, LayoutDashboard, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { HttpPublicDashboardAdapter } from '../../../secondary/api/public-dashboard-api.adapter';
import { PublicDashboardFilterPanel } from './PublicDashboardFilterPanel';
import { PublicDashboardExportToolbar } from './PublicDashboardExportToolbar';
import { PublicDashboardSummaryCards } from './PublicDashboardSummaryCards';
import { PublicDashboardCharts } from './PublicDashboardCharts';
import { PublicDashboardSection } from './PublicDashboardPanel';

export function PublicDashboardHome() {
  const dashboardApi = useMemo(() => new HttpPublicDashboardAdapter(), []);

  return (
    <div className={publicDashboardClasses.page} data-testid="public-dashboard-home">
      <header className={publicDashboardClasses.hero} data-testid="public-dashboard-hero">
        <p className={publicDashboardClasses.heroEyebrow}>Public Dashboard</p>
        <h1 className={`${publicDashboardClasses.heroTitle} flex items-center gap-3`}>
          <LayoutDashboard className="h-8 w-8 shrink-0 text-nac-orange sm:h-9 sm:w-9" aria-hidden="true" />
          Parish Development Model Insights
        </h1>
        <p className={publicDashboardClasses.heroLead}>
          Explore anonymised programme data across districts, parishes, and enterprise categories. Adjust filters to
          refine summary statistics and charts — ready for donor and government presentations.
        </p>
      </header>

      <PublicDashboardSection
        title="Filters"
        icon={<SlidersHorizontal className="h-5 w-5" aria-hidden="true" />}
        testId="public-dashboard-filters-section"
      >
        <PublicDashboardFilterPanel dashboardApi={dashboardApi} />
      </PublicDashboardSection>

      <PublicDashboardSection
        title="Export & download"
        icon={<FileDown className="h-5 w-5" aria-hidden="true" />}
        testId="public-dashboard-export-section"
      >
        <PublicDashboardExportToolbar />
      </PublicDashboardSection>

      <PublicDashboardSection
        title="Summary statistics"
        icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
        testId="public-dashboard-summary-section"
      >
        <PublicDashboardSummaryCards dashboardApi={dashboardApi} />
      </PublicDashboardSection>

      <PublicDashboardCharts dashboardApi={dashboardApi} />
    </div>
  );
}
