import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { buildDuplicateBudgetPriorityMessage } from '../../../../core/budget-priority-errors';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';

export interface BudgetPriorityDuplicateBlockProps {
  section: BudgetPrioritySection;
  financialYearPeriod?: string;
  message?: string;
}

export function BudgetPriorityDuplicateBlock({
  section,
  financialYearPeriod,
  message,
}: BudgetPriorityDuplicateBlockProps) {
  const copy =
    message ?? buildDuplicateBudgetPriorityMessage(section, financialYearPeriod);

  return (
    <div
      className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100"
      role="alert"
      data-testid="budget-priority-duplicate-block"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Already submitted for this sector</p>
          <p className="mt-1">{copy}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={BUDGET_PRIORITY_ROUTES.index}
          className="inline-flex min-h-10 items-center rounded-xl border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-950 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-900/40"
        >
          Choose another sector
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold text-amber-900 underline-offset-2 hover:underline dark:text-amber-200"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
