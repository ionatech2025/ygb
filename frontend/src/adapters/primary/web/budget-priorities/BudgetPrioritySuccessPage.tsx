import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutDashboard, ListChecks } from 'lucide-react';
import {
  BUDGET_PRIORITY_SECTIONS,
  getBudgetPrioritySection,
  type BudgetPrioritySection,
} from '../../../../core/domain/budget-priority-section.model';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import type { BudgetPrioritySuccessNavigationState } from '../../../../core/domain/budget-priority-submission.model';
import { formatBudgetPriorityFinancialYearLabel } from '../../../../core/budget-priority-errors';
import { publicDashboardClasses, publicResourcesClasses } from '../../../../core/domain/public-dashboard.theme';

function getOtherBudgetPrioritySections(current: BudgetPrioritySection) {
  return BUDGET_PRIORITY_SECTIONS.filter((section) => section.id !== current);
}

export function BudgetPrioritySuccessPage() {
  const { section: sectionParam } = useParams<{ section: string }>();
  const location = useLocation();
  const section = getBudgetPrioritySection(sectionParam);
  const state = location.state as BudgetPrioritySuccessNavigationState | null;

  if (!section || !state?.result || state.result.section !== section.id) {
    return <Navigate to={BUDGET_PRIORITY_ROUTES.index} replace />;
  }

  const otherSections = getOtherBudgetPrioritySections(section.id);
  const financialYearLabel = formatBudgetPriorityFinancialYearLabel(state.result.financialYearPeriod);

  return (
    <div className={publicResourcesClasses.page} data-testid="budget-priority-success-page">
      <Link to={BUDGET_PRIORITY_ROUTES.index} className={publicResourcesClasses.backLink}>
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        All sectors
      </Link>

      <section
        className={`${publicDashboardClasses.panel} mt-4 space-y-6 p-6 sm:p-8`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Submission received</p>
            <h1 className="text-xl font-bold text-text sm:text-2xl">Thank you for sharing your priorities</h1>
            <p className="text-sm text-text-muted">
              Your <span className="font-semibold text-text">{section.label}</span> submission for{' '}
              <span className="font-semibold text-text">{financialYearLabel}</span> has been recorded.
            </p>
          </div>
        </div>

        {otherSections.length > 0 && (
          <div className="space-y-3 border-t border-border/60 pt-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
              <ListChecks className="h-4 w-4 text-brand" aria-hidden="true" />
              Submit priorities for another sector
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {otherSections.map((other) => (
                <li key={other.id}>
                  <Link
                    to={BUDGET_PRIORITY_ROUTES.section(other.id)}
                    data-testid={`budget-priority-success-link-${other.id}`}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm font-semibold text-text transition hover:border-brand/40 hover:bg-brand-light/40"
                  >
                    Submit {other.shortLabel} priorities
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-border/60 pt-5">
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-hover"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            View public dashboard
          </Link>
          <Link
            to={BUDGET_PRIORITY_ROUTES.index}
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold text-text transition hover:bg-surface-muted"
          >
            Back to all sectors
          </Link>
        </div>
      </section>
    </div>
  );
}
