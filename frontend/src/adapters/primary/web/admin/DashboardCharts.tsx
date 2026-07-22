import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { DashboardService } from '../../../../core/DashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import type {
  DashboardChartDrillDownEvent,
  DashboardChartsViewModel,
} from '../../../../core/domain/dashboard-charts.model';
import { buildDashboardFilterQueryString } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import { GenderSplitChart } from './GenderSplitChart';
import { SubmissionsByDistrictChart } from './SubmissionsByDistrictChart';
import { SubmissionsOverTimeChart } from './SubmissionsOverTimeChart';

export interface DashboardChartsProps {
  dashboardApi: IDashboardApiPort;
  onDrillDown?: (event: DashboardChartDrillDownEvent) => void;
}

const EMPTY_CHARTS: DashboardChartsViewModel = {
  byDistrict: [],
  byGender: [],
  overTime: [],
};

function ChartsSkeleton() {
  return (
    <div
      data-testid="dashboard-charts-skeleton"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading dashboard charts"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm ${index === 0 ? 'lg:col-span-2' : ''}`}
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

export function DashboardCharts({ dashboardApi, onDrillDown }: DashboardChartsProps) {
  const filter = useDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = useDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new DashboardService(dashboardApi), [dashboardApi]);

  const [charts, setCharts] = useState<DashboardChartsViewModel>(EMPTY_CHARTS);
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
            setCharts(EMPTY_CHARTS);
            setError('');
          } else {
            setCharts(EMPTY_CHARTS);
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
    <section aria-label="Dashboard charts" data-testid="dashboard-charts">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
        <BarChart3 className="h-5 w-5 text-brand" aria-hidden="true" />
        Charts
      </h2>

      {error && (
        <div
          role="alert"
          data-testid="dashboard-charts-error"
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartPanel title="Submissions over time" testId="chart-panel-over-time" className="lg:col-span-2">
          <SubmissionsOverTimeChart data={charts.overTime} onDrillDown={onDrillDown} />
        </ChartPanel>
        <ChartPanel title="Submissions by district" testId="chart-panel-district">
          <SubmissionsByDistrictChart data={charts.byDistrict} onDrillDown={onDrillDown} />
        </ChartPanel>
        <ChartPanel title="Gender split" testId="chart-panel-gender">
          <GenderSplitChart data={charts.byGender} onDrillDown={onDrillDown} />
        </ChartPanel>
      </div>
    </section>
  );
}
