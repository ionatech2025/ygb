import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { buildDuplicateBudgetPriorityMessage } from '../../../../core/budget-priority-errors';
import { BUDGET_PRIORITY_ROUTES } from '../../../../core/domain/budget-priority.routes';
import { budgetPrioritiesClasses } from '../../../../core/domain/budget-priorities.theme';

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
      className={budgetPrioritiesClasses.duplicateBlock}
      role="alert"
      data-testid="budget-priority-duplicate-block"
    >
      <div className="flex items-start gap-3">
        <div className={budgetPrioritiesClasses.duplicateIconWrap} aria-hidden="true">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">Already submitted for this sector</p>
          <p className="mt-1">{copy}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={BUDGET_PRIORITY_ROUTES.index} className={budgetPrioritiesClasses.duplicateActionPrimary}>
          Choose another sector
        </Link>
        <Link to="/dashboard" className={budgetPrioritiesClasses.duplicateActionSecondary}>
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
