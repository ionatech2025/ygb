import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../../../../core/domain/lgo-budget-allocation.routes';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { HttpLgoBudgetAllocationDashboardAdapter } from '../../../secondary/api/lgo-budget-allocation-dashboard-api.adapter';
import { LgoBudgetAllocationDashboardFilterPanel } from './LgoBudgetAllocationDashboardFilterPanel';
import { LgoBudgetAllocationSummaryCards } from './LgoBudgetAllocationSummaryCards';
import { LgoBudgetAllocationCharts } from './LgoBudgetAllocationCharts';
import { LgoBudgetAllocationExportToolbar } from './LgoBudgetAllocationExportToolbar';

export function PublicLgoBudgetAllocationPage() {
  const dashboardApi = useMemo(() => new HttpLgoBudgetAllocationDashboardAdapter(), []);

  return (
    <div className={lgoBudgetAllocationClasses.dashboardPage} data-testid="public-lgo-budget-allocation-dashboard">
      <header className={lgoBudgetAllocationClasses.dashboardHero} data-testid="lgo-dashboard-hero">
        <span className={lgoBudgetAllocationClasses.heroAccent} aria-hidden="true" />
        <span className={lgoBudgetAllocationClasses.heroGlow} aria-hidden="true" />

        <div
          className={`${lgoBudgetAllocationClasses.heroContent} flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between`}
        >
          <div className="min-w-0 flex-1">
            <p className={lgoBudgetAllocationClasses.heroEyebrow}>Public dashboard</p>
            <h1 className={`${lgoBudgetAllocationClasses.heroTitle} flex items-center gap-3`}>
              <LayoutDashboard className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
              LGO Budget Allocation Insights
            </h1>
            <p className={lgoBudgetAllocationClasses.heroLead}>
              Explore anonymised local government budget allocation interviews by district, sector, and financial
              year. Adjust filters to update summary statistics and comparative charts — no personal data is shown.
            </p>
            <div className={lgoBudgetAllocationClasses.heroBadges}>
              <span className={lgoBudgetAllocationClasses.heroBadge}>
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" aria-hidden="true" />
                No PII
              </span>
              <span className={lgoBudgetAllocationClasses.heroBadge}>
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-nac-blue dark:text-blue-300" aria-hidden="true" />
                Aggregated only
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={LGO_BUDGET_ALLOCATION_ROUTES.index}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text transition hover:bg-surface-muted"
              >
                <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
                Collector form
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text-muted transition hover:bg-surface-muted hover:text-text"
              >
                PDM dashboard
              </Link>
            </div>
          </div>

          <div className="w-full shrink-0 xl:max-w-sm" data-testid="lgo-dashboard-export-section">
            <LgoBudgetAllocationExportToolbar layout="inline" />
          </div>
        </div>
      </header>

      <section data-testid="lgo-dashboard-filters-section" className={lgoBudgetAllocationClasses.dashboardSection}>
        <h2 className={lgoBudgetAllocationClasses.sectionHeading}>
          <BarChart3 className={lgoBudgetAllocationClasses.sectionHeadingIcon} aria-hidden="true" />
          Explore data
        </h2>
        <LgoBudgetAllocationDashboardFilterPanel dashboardApi={dashboardApi} />
      </section>

      <section data-testid="lgo-dashboard-summary-section" className={lgoBudgetAllocationClasses.dashboardSection}>
        <h2 className={lgoBudgetAllocationClasses.sectionHeading}>
          <BarChart3 className={lgoBudgetAllocationClasses.sectionHeadingIcon} aria-hidden="true" />
          Summary statistics
        </h2>
        <LgoBudgetAllocationSummaryCards dashboardApi={dashboardApi} />
      </section>

      <LgoBudgetAllocationCharts dashboardApi={dashboardApi} />
    </div>
  );
}
