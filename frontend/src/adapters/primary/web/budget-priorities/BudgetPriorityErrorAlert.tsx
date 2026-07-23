import { AlertTriangle } from 'lucide-react';

export interface BudgetPriorityErrorAlertProps {
  title?: string;
  message: string;
}

export function BudgetPriorityErrorAlert({ title, message }: BudgetPriorityErrorAlertProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
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
