import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { PublicDashboardService } from '../../../../core/PublicDashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import {
  EMPTY_PUBLIC_DASHBOARD_CHARTS,
  type PublicDashboardChartsViewModel,
} from '../../../../core/domain/public-dashboard-charts.model';
import { buildPublicDashboardFilterQueryString } from '../../../../core/domain/public-dashboard-filter.model';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';
import { PublicAgeGroupChart } from './PublicAgeGroupChart';
import { PublicGenderSplitChart } from './PublicGenderSplitChart';
import { PublicGeographicHeatmap } from './PublicGeographicHeatmap';
import { PublicSubmissionsByDistrictChart } from './PublicSubmissionsByDistrictChart';
import { PublicSubmissionsOverTimeChart } from './PublicSubmissionsOverTimeChart';

export interface PublicDashboardChartsProps {
  dashboardApi: IPublicDashboardApiPort;
}

function ChartsSkeleton() {
  return (
    <div
      data-testid="public-dashboard-charts-skeleton"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading dashboard charts"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm ${index === 0 || index === 4 ? 'lg:col-span-2' : ''}`}
        >
          <div className="mb-4 h-3 w-40 rounded bg-surface-muted" />
          <div className="h-64 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

function ChartPanel({
  title,
  testId,
  children,
  className,
}: {
  title: string;
  testId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      data-testid={testId}
      className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className ?? ''}`}
    >
      <h3 className="mb-4 text-sm font-semibold text-text">{title}</h3>
      {children}
    </article>
  );
}

export function PublicDashboardCharts({ dashboardApi }: PublicDashboardChartsProps) {
  const filter = usePublicDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = usePublicDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildPublicDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new PublicDashboardService(dashboardApi), [dashboardApi]);

  const [charts, setCharts] = useState<PublicDashboardChartsViewModel>(EMPTY_PUBLIC_DASHBOARD_CHARTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const nextCharts = await dashboardService.loadCharts(filter);
        if (!cancelled) {
          setCharts(nextCharts);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError || err instanceof Error
              ? err.message
              : 'Failed to load dashboard charts.';

          if (isDashboardLocationFilterError(message)) {
            setLocationFilterError(formatLocationFilterRecoveryMessage(message));
            setCharts(EMPTY_PUBLIC_DASHBOARD_CHARTS);
            setError('');
          } else {
            setCharts(EMPTY_PUBLIC_DASHBOARD_CHARTS);
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
    return <ChartsSkeleton />;
  }

  return (
    <section aria-label="Dashboard charts" data-testid="public-dashboard-charts">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
        <BarChart3 className="h-5 w-5 text-brand" aria-hidden="true" />
        Charts
      </h2>

      {error && (
        <div
          role="alert"
          data-testid="public-dashboard-charts-error"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartPanel title="Submissions over time" testId="chart-panel-over-time" className="lg:col-span-2">
          <PublicSubmissionsOverTimeChart data={charts.overTime} />
        </ChartPanel>
        <ChartPanel title="Submissions by district" testId="chart-panel-district">
          <PublicSubmissionsByDistrictChart data={charts.byDistrict} />
        </ChartPanel>
        <ChartPanel title="Gender split" testId="chart-panel-gender">
          <PublicGenderSplitChart data={charts.byGender} />
        </ChartPanel>
        <ChartPanel title="Age group distribution" testId="chart-panel-age-group">
          <PublicAgeGroupChart data={charts.byAgeGroup} />
        </ChartPanel>
        <ChartPanel title="Geographic heat map" testId="chart-panel-heatmap" className="lg:col-span-2">
          <PublicGeographicHeatmap data={charts.heatmap} />
        </ChartPanel>
      </div>
    </section>
  );
}
