import { AlertTriangle } from 'lucide-react';
import { budgetPrioritiesClasses } from '../../../../core/domain/budget-priorities.theme';

export interface BudgetPriorityErrorAlertProps {
  title?: string;
  message: string;
}

export function BudgetPriorityErrorAlert({ title, message }: BudgetPriorityErrorAlertProps) {
  return (
    <div
      className={budgetPrioritiesClasses.errorAlert}
      role="alert"
      data-testid="budget-priority-error-alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className={title ? 'mt-0.5' : undefined}>{message}</p>
      </div>
    </div>
  );
}
