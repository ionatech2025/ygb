import { CheckCircle2 } from 'lucide-react';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';

export interface LgoBudgetAllocationSuccessBannerProps {
  isOnline: boolean;
}

export function LgoBudgetAllocationSuccessBanner({ isOnline }: LgoBudgetAllocationSuccessBannerProps) {
  return (
    <div
      className={lgoBudgetAllocationClasses.successBanner}
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
