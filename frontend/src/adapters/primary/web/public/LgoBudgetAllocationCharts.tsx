import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { LgoBudgetAllocationDashboardService } from '../../../../core/LgoBudgetAllocationDashboardService';
import {
  formatLocationFilterRecoveryMessage,
  isDashboardLocationFilterError,
} from '../../../../core/domain/dashboard-filter-location.validation';
import {
  EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_CHARTS,
  type LgoBudgetAllocationDashboardChartsViewModel,
} from '../../../../core/domain/lgo-budget-allocation-dashboard-charts.model';
import { buildLgoBudgetAllocationDashboardFilterQueryString } from '../../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useLgoBudgetAllocationDashboardFilterStore } from '../../../../core/store/useLgoBudgetAllocationDashboardFilterStore';
import type { ILgoBudgetAllocationDashboardApiPort } from '../../../../ports/lgo-budget-allocation-dashboard-api.port';
import { BudgetPriorityCountBarChart } from './BudgetPriorityCountBarChart';
import { PublicSubmissionsOverTimeChart } from './PublicSubmissionsOverTimeChart';
import { PublicDashboardPanel, PublicDashboardSection } from './PublicDashboardPanel';

export interface LgoBudgetAllocationChartsProps {
  dashboardApi: ILgoBudgetAllocationDashboardApiPort;
}

function ChartsSkeleton() {
  return (
    <div
      data-testid="lgo-dashboard-charts-skeleton"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading LGO budget allocation charts"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse ${publicDashboardClasses.chartPanel} ${index === 0 ? 'lg:col-span-2' : ''}`}
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

export function LgoBudgetAllocationCharts({ dashboardApi }: LgoBudgetAllocationChartsProps) {
  const filter = useLgoBudgetAllocationDashboardFilterStore((state) => state.filter);
  const setLocationFilterError = useLgoBudgetAllocationDashboardFilterStore((state) => state.setLocationFilterError);
  const filterKey = buildLgoBudgetAllocationDashboardFilterQueryString(filter);
  const dashboardService = useMemo(() => new LgoBudgetAllocationDashboardService(dashboardApi), [dashboardApi]);

  const [charts, setCharts] = useState<LgoBudgetAllocationDashboardChartsViewModel>(
    EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_CHARTS
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
              : 'Failed to load LGO budget allocation charts.';

          if (isDashboardLocationFilterError(message)) {
            setLocationFilterError(formatLocationFilterRecoveryMessage(message));
            setCharts(EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_CHARTS);
            setError('');
          } else {
            setCharts(EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_CHARTS);
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
        title="Allocation charts"
        icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
        testId="lgo-budget-allocation-charts-section"
      >
        <ChartsSkeleton />
      </PublicDashboardSection>
    );
  }

  return (
    <PublicDashboardSection
      title="Allocation charts"
      icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
      testId="lgo-budget-allocation-charts-section"
    >
      {error && (
        <div
          role="alert"
          data-testid="lgo-dashboard-charts-error"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        aria-label="LGO budget allocation charts"
        data-testid="lgo-budget-allocation-charts"
      >
        <ChartPanel
          title="Submissions by district"
          testId="chart-panel-by-district"
          className="lg:col-span-2"
        >
          <BudgetPriorityCountBarChart
            data={charts.byDistrict}
            emptyTestId="chart-by-district-empty"
            chartTestId="chart-by-district"
            ariaLabel="Bar chart comparing LGO budget allocation submissions across districts"
            emptyMessage="No district comparison data for the current filters."
          />
        </ChartPanel>
        <ChartPanel title="Submissions by sector" testId="chart-panel-by-sector">
          <BudgetPriorityCountBarChart
            data={charts.bySector}
            emptyTestId="chart-by-sector-empty"
            chartTestId="chart-by-sector"
            ariaLabel="Bar chart of submissions by sector"
            emptyMessage="No sector data for the current filters."
          />
        </ChartPanel>
        <ChartPanel title="Submissions over time" testId="chart-panel-over-time">
          <PublicSubmissionsOverTimeChart data={charts.overTime} />
        </ChartPanel>
      </div>
    </PublicDashboardSection>
  );
}
