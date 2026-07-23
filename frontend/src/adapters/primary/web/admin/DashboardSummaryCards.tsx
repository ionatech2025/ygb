import { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { DashboardService } from '../../../../core/DashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import { buildDashboardFilterQueryString } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import { StatCard } from './StatCard';

export interface DashboardSummaryCardsProps {
  dashboardApi: IDashboardApiPort;
}

function SummaryCardsSkeleton() {
  return (
    <div
      data-testid="dashboard-summary-skeleton"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-busy="true"
      aria-label="Loading summary statistics"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="mt-4 h-8 w-16 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSummaryCards({ dashboardApi }: DashboardSummaryCardsProps) {
  const filter = useDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = useDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new DashboardService(dashboardApi), [dashboardApi]);

  const [cards, setCards] = useState<StatCardViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const nextCards = await dashboardService.loadSummaryCards(filter);
        if (!cancelled) {
          setCards(nextCards);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError || err instanceof Error
              ? err.message
              : 'Failed to load dashboard summary.';

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
    <section aria-label="Summary statistics" data-testid="dashboard-summary-cards">
      {error && (
        <div
          role="alert"
          data-testid="dashboard-summary-error"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <StatCard key={card.id} card={card} accentIndex={index} />
        ))}
      </div>
    </section>
  );
}
