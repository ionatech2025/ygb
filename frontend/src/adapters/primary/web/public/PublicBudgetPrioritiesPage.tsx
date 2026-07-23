import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { HttpBudgetPriorityDashboardAdapter } from '../../../secondary/api/budget-priority-dashboard-api.adapter';
import { BudgetPriorityDashboardFilterPanel } from './BudgetPriorityDashboardFilterPanel';
import { BudgetPrioritySummaryCards } from './BudgetPrioritySummaryCards';
import { BudgetPriorityCharts } from './BudgetPriorityCharts';

export function PublicBudgetPrioritiesPage() {
  const dashboardApi = useMemo(() => new HttpBudgetPriorityDashboardAdapter(), []);

  return (
    <div className={publicDashboardClasses.page} data-testid="public-budget-priorities-dashboard">
      <header className={publicDashboardClasses.hero} data-testid="bp-dashboard-hero">
        <span className={publicDashboardClasses.heroAccent} aria-hidden="true" />
        <span className={publicDashboardClasses.heroGlow} aria-hidden="true" />

        <div className={publicDashboardClasses.heroContent}>
          <p className={publicDashboardClasses.heroEyebrow}>Public dashboard</p>
          <h1 className={`${publicDashboardClasses.heroTitle} flex items-center gap-3`}>
            <LayoutDashboard className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            Budget Priorities Insights
          </h1>
          <p className={publicDashboardClasses.heroLead}>
            Explore anonymised citizen budget priority submissions by sector, location, and priority area. Adjust
            filters to update summary statistics and charts — no personal data is shown.
          </p>
          <div className={publicDashboardClasses.heroBadges}>
            <span className={publicDashboardClasses.heroBadge}>
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" aria-hidden="true" />
              No PII
            </span>
            <span className={publicDashboardClasses.heroBadge}>
              <Sparkles className="mr-1 inline h-3.5 w-3.5 text-nac-blue dark:text-blue-300" aria-hidden="true" />
              Aggregated only
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to={BUDGET_PRIORITY_ROUTES.index}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text transition hover:bg-surface-muted"
            >
              <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
              Submit priorities
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-text-muted transition hover:bg-surface-muted hover:text-text"
            >
              PDM dashboard
            </Link>
          </div>
        </div>
      </header>

      <section data-testid="bp-dashboard-filters-section" className={publicDashboardClasses.section}>
        <h2 className={publicDashboardClasses.sectionHeading}>
          <BarChart3 className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Explore data
        </h2>
        <BudgetPriorityDashboardFilterPanel dashboardApi={dashboardApi} />
      </section>

      <section data-testid="bp-dashboard-summary-section" className={publicDashboardClasses.section}>
        <h2 className={publicDashboardClasses.sectionHeading}>
          <BarChart3 className={publicDashboardClasses.sectionHeadingIcon} aria-hidden="true" />
          Summary statistics
        </h2>
        <BudgetPrioritySummaryCards dashboardApi={dashboardApi} />
      </section>

      <BudgetPriorityCharts dashboardApi={dashboardApi} />
    </div>
  );
}
