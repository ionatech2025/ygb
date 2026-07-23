import { CheckCircle2 } from 'lucide-react';

export interface LgoBudgetAllocationSuccessBannerProps {
  isOnline: boolean;
}

export function LgoBudgetAllocationSuccessBanner({ isOnline }: LgoBudgetAllocationSuccessBannerProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
      role="status"
      data-testid="lgo-budget-allocation-success-banner"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {isOnline
          ? 'Submission saved and syncing to the server.'
          : 'Saved locally. Your LGO budget allocation will sync when online.'}
      </span>
    </div>
  );
}
