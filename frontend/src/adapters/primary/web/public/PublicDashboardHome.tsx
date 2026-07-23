import { useMemo } from 'react';
import { BarChart3, LayoutDashboard, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { HttpPublicDashboardAdapter } from '../../../secondary/api/public-dashboard-api.adapter';
import { PublicDashboardFilterPanel } from './PublicDashboardFilterPanel';
import { PublicDashboardExportToolbar } from './PublicDashboardExportToolbar';
import { PublicDashboardSummaryCards } from './PublicDashboardSummaryCards';
import { PublicDashboardCharts } from './PublicDashboardCharts';

export function PublicDashboardHome() {
  const dashboardApi = useMemo(() => new HttpPublicDashboardAdapter(), []);

  return (
    <div className={publicDashboardClasses.page} data-testid="public-dashboard-home">
      <header className={publicDashboardClasses.hero} data-testid="public-dashboard-hero">
        <span className={publicDashboardClasses.heroAccent} aria-hidden="true" />
        <span className={publicDashboardClasses.heroGlow} aria-hidden="true" />

        <div
          className={`${publicDashboardClasses.heroContent} flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between`}
        >
          <div className="min-w-0 flex-1">
            <p className={publicDashboardClasses.heroEyebrow}>Public dashboard</p>
            <h1 className={`${publicDashboardClasses.heroTitle} flex items-center gap-3`}>
              <LayoutDashboard className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
              Parish Development Model Insights
            </h1>
            <p className={publicDashboardClasses.heroLead}>
              Explore anonymised programme data across districts and parishes. Adjust filters to update summary
              statistics and charts in real time — built for transparency, research, and stakeholder presentations.
            </p>
            <div className={publicDashboardClasses.heroBadges}>
              <span className={publicDashboardClasses.heroBadge}>
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" aria-hidden="true" />
                No PII
              </span>
              <span className={publicDashboardClasses.heroBadge}>
                <Zap className="mr-1 inline h-3.5 w-3.5 text-nac-orange" aria-hidden="true" />
                Live filters
              </span>
              <span className={publicDashboardClasses.heroBadge}>
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-nac-blue dark:text-blue-300" aria-hidden="true" />
                Open data export
              </span>
            </div>
          </div>

          <div
            className="w-full shrink-0 xl:max-w-sm"
            data-testid="public-dashboard-export-section"
          >
            <PublicDashboardExportToolbar layout="inline" />
          </div>
        </div>
      </header>

      <section data-testid="public-dashboard-filters-section" className={publicDashboardClasses.section}>
        <h2 className={publicDashboardClasses.sectionHeading}>
          <BarChart3 className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Explore data
        </h2>
        <PublicDashboardFilterPanel dashboardApi={dashboardApi} />
      </section>

      <section data-testid="public-dashboard-summary-section" className={publicDashboardClasses.section}>
        <h2 className={publicDashboardClasses.sectionHeading}>
          <BarChart3 className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Summary statistics
        </h2>
        <PublicDashboardSummaryCards dashboardApi={dashboardApi} />
      </section>

      <PublicDashboardCharts dashboardApi={dashboardApi} />
    </div>
  );
}
