import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { BudgetPriorityDashboardService } from '../../../../core/BudgetPriorityDashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import {
  EMPTY_BUDGET_PRIORITY_DASHBOARD_CHARTS,
  type BudgetPriorityDashboardChartsViewModel,
} from '../../../../core/domain/budget-priority-dashboard-charts.model';
import { buildBudgetPriorityDashboardFilterQueryString } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import type { IBudgetPriorityDashboardApiPort } from '../../../../ports/budget-priority-dashboard-api.port';
import { BudgetPriorityCountBarChart } from './BudgetPriorityCountBarChart';
import { PublicSubmissionsOverTimeChart } from './PublicSubmissionsOverTimeChart';
import { PublicDashboardPanel, PublicDashboardSection } from './PublicDashboardPanel';

export interface BudgetPriorityChartsProps {
  dashboardApi: IBudgetPriorityDashboardApiPort;
}

function ChartsSkeleton() {
  return (
    <div
      data-testid="bp-dashboard-charts-skeleton"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading budget priority charts"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse ${publicDashboardClasses.chartPanel} ${index === 2 ? 'lg:col-span-2' : ''}`}
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
    <PublicDashboardPanel title={title} testId={testId} className={className}>
      {children}
    </PublicDashboardPanel>
  );
}

export function BudgetPriorityCharts({ dashboardApi }: BudgetPriorityChartsProps) {
  const filter = useBudgetPriorityDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = useBudgetPriorityDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildBudgetPriorityDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new BudgetPriorityDashboardService(dashboardApi), [dashboardApi]);

  const [charts, setCharts] = useState<BudgetPriorityDashboardChartsViewModel>(
    EMPTY_BUDGET_PRIORITY_DASHBOARD_CHARTS
  );
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
              : 'Failed to load budget priority charts.';

          if (isDashboardLocationFilterError(message)) {
            setLocationFilterError(formatLocationFilterRecoveryMessage(message));
            setCharts(EMPTY_BUDGET_PRIORITY_DASHBOARD_CHARTS);
            setError('');
          } else {
            setCharts(EMPTY_BUDGET_PRIORITY_DASHBOARD_CHARTS);
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
    return (
      <PublicDashboardSection
        title="Priority charts"
        icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
        testId="budget-priority-charts-section"
      >
        <ChartsSkeleton />
      </PublicDashboardSection>
    );
  }

  return (
    <PublicDashboardSection
      title="Priority charts"
      icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
      testId="budget-priority-charts-section"
    >
      {error && (
        <div
          role="alert"
          data-testid="bp-dashboard-charts-error"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        aria-label="Budget priority charts"
        data-testid="budget-priority-charts"
      >
        <ChartPanel title="Submissions by priority area" testId="chart-panel-priority-area">
          <BudgetPriorityCountBarChart
            data={charts.byPriorityArea}
            emptyTestId="chart-priority-area-empty"
            chartTestId="chart-by-priority-area"
            ariaLabel="Bar chart of submissions by priority area"
            emptyMessage="No priority area data for the current filters."
          />
        </ChartPanel>
        <ChartPanel title="Submissions by sector" testId="chart-panel-sector">
          <BudgetPriorityCountBarChart
            data={charts.bySector}
            emptyTestId="chart-sector-empty"
            chartTestId="chart-by-sector"
            ariaLabel="Bar chart of submissions by sector"
            emptyMessage="No sector data for the current filters."
          />
        </ChartPanel>
        <ChartPanel title="Submissions over time" testId="chart-panel-over-time" className="lg:col-span-2">
          <PublicSubmissionsOverTimeChart data={charts.overTime} />
        </ChartPanel>
      </div>
    </PublicDashboardSection>
  );
}
