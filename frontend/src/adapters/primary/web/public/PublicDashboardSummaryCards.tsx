import { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { PublicDashboardService } from '../../../../core/PublicDashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';
import { buildPublicDashboardFilterQueryString } from '../../../../core/domain/public-dashboard-filter.model';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { PublicStatCard } from './PublicStatCard';

export interface PublicDashboardSummaryCardsProps {
  dashboardApi: IPublicDashboardApiPort;
}

function SummaryCardsSkeleton() {
  return (
    <div
      data-testid="public-dashboard-summary-skeleton"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading summary statistics"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse ${publicDashboardClasses.statCard}`}
        >
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="mt-4 h-8 w-16 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

export function PublicDashboardSummaryCards({ dashboardApi }: PublicDashboardSummaryCardsProps) {
  const filter = usePublicDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = usePublicDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildPublicDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new PublicDashboardService(dashboardApi), [dashboardApi]);

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
    <section aria-label="Summary statistics" data-testid="public-dashboard-summary-cards">
      {error && (
        <div
          role="alert"
          data-testid="public-dashboard-summary-error"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <PublicStatCard key={card.id} card={card} accentIndex={index} />
        ))}
      </div>
    </section>
  );
}
