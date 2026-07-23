import type { EChartsOption } from 'echarts';
import type { PublicTimeSeriesChartItem } from '../../../../core/domain/public-dashboard-charts.model';
import {
  PUBLIC_CHART_AXIS,
  PUBLIC_CHART_COLORS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface PublicSubmissionsOverTimeChartProps {
  data: PublicTimeSeriesChartItem[];
}

function buildOption(data: PublicTimeSeriesChartItem[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 48 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.label),
      axisLabel: { color: PUBLIC_CHART_AXIS.label },
      axisLine: { lineStyle: { color: PUBLIC_CHART_AXIS.grid } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: PUBLIC_CHART_AXIS.label },
      splitLine: { lineStyle: { color: PUBLIC_CHART_AXIS.grid } },
    },
    series: [
      {
        type: 'line',
        data: data.map((entry) => entry.count),
        smooth: true,
        symbolSize: 8,
        lineStyle: { color: PUBLIC_CHART_COLORS.nacBlue, width: 2 },
        itemStyle: { color: PUBLIC_CHART_COLORS.nacBlue },
        areaStyle: { color: 'rgba(25, 55, 109, 0.1)' },
      },
    ],
  };
}

export function PublicSubmissionsOverTimeChart({ data }: PublicSubmissionsOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="chart-over-time-empty">
        No time-series data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="chart-submissions-over-time"
      ariaLabel="Line chart of submissions over time"
      option={buildOption(data)}
    />
  );
}
