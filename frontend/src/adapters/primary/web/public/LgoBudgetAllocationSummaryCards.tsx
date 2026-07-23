import { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { LgoBudgetAllocationDashboardService } from '../../../../core/LgoBudgetAllocationDashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import { buildLgoBudgetAllocationDashboardFilterQueryString } from '../../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useLgoBudgetAllocationDashboardFilterStore } from '../../../../core/store/useLgoBudgetAllocationDashboardFilterStore';
import type { ILgoBudgetAllocationDashboardApiPort } from '../../../../ports/lgo-budget-allocation-dashboard-api.port';
import { PublicStatCard } from './PublicStatCard';

export interface LgoBudgetAllocationSummaryCardsProps {
  dashboardApi: ILgoBudgetAllocationDashboardApiPort;
}

function SummaryCardsSkeleton() {
  return (
    <div
      data-testid="lgo-dashboard-summary-skeleton"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading LGO budget allocation summary statistics"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={`animate-pulse ${publicDashboardClasses.statCard}`}>
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="mt-4 h-8 w-16 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

export function LgoBudgetAllocationSummaryCards({ dashboardApi }: LgoBudgetAllocationSummaryCardsProps) {
  const filter = useLgoBudgetAllocationDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = useLgoBudgetAllocationDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildLgoBudgetAllocationDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new LgoBudgetAllocationDashboardService(dashboardApi), [dashboardApi]);

  const [cards, setCards] = useState<StatCardViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      setIsEmpty(false);
      try {
        const nextCards = await dashboardService.loadSummaryCards(filter);
        if (!cancelled) {
          setCards(nextCards);
          const total = nextCards.find((card) => card.id === 'total-submissions');
          setIsEmpty(total?.primaryValue === '0');
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError || err instanceof Error
              ? err.message
              : 'Failed to load LGO budget allocation summary.';

          if (isDashboardLocationFilterError(message)) {
            setLocationFilterError(formatLocationFilterRecoveryMessage(message));
            setCards([]);
            setError('');
          } else {
            setCards([]);
            setError(message);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [dashboardService, filter, filterKey, setLocationFilterError]);

  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  return (
    <section aria-label="LGO budget allocation summary statistics" data-testid="lgo-budget-allocation-summary-cards">
      {error && (
        <div
          role="alert"
          data-testid="lgo-dashboard-summary-error"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {isEmpty && !error && (
        <p
          className="mb-4 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-muted"
          data-testid="lgo-dashboard-empty-state"
          role="status"
        >
          No LGO budget allocation submissions match the current filters yet. Try clearing filters or check back
          later.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <PublicStatCard key={card.id} card={card} accentIndex={index} />
        ))}
      </div>
    </section>
  );
}
