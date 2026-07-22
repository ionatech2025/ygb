import { AlertTriangle } from 'lucide-react';

export interface DuplicateRespondentAlertProps {
  message: string;
}

export function DuplicateRespondentAlert({ message }: DuplicateRespondentAlertProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
      role="alert"
      data-testid="duplicate-respondent-alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
