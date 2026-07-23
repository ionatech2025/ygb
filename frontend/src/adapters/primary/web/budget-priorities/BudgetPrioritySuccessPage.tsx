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
import { budgetPrioritiesClasses } from '../../../../core/domain/budget-priorities.theme';

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
    <div className={budgetPrioritiesClasses.page} data-testid="budget-priority-success-page">
      <Link to={BUDGET_PRIORITY_ROUTES.index} className={budgetPrioritiesClasses.backLink}>
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        All sectors
      </Link>

      <section
        className={budgetPrioritiesClasses.successPanel}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className={budgetPrioritiesClasses.successIconWrap} aria-hidden="true">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className={budgetPrioritiesClasses.successEyebrow}>Submission received</p>
            <h1 className={budgetPrioritiesClasses.successTitle}>Thank you for sharing your priorities</h1>
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
                    className={budgetPrioritiesClasses.successSectorLink}
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
          <Link to="/dashboard" className={budgetPrioritiesClasses.successPrimaryAction}>
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            View public dashboard
          </Link>
          <Link to={BUDGET_PRIORITY_ROUTES.index} className={budgetPrioritiesClasses.successSecondaryAction}>
            Back to all sectors
          </Link>
        </div>
      </section>
    </div>
  );
}
