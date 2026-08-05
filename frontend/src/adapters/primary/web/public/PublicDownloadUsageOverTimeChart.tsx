import type { EChartsOption } from 'echarts';
import type { PublicTimeSeriesDownloadPoint } from '../../../../core/domain/public-download-usage.model';
import {
  PUBLIC_CHART_AXIS,
  PUBLIC_CHART_COLORS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface PublicDownloadUsageOverTimeChartProps {
  data: PublicTimeSeriesDownloadPoint[];
}

function buildOption(data: PublicTimeSeriesDownloadPoint[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 48 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.bucketStart),
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
        lineStyle: { color: PUBLIC_CHART_COLORS.brand, width: 2 },
        itemStyle: { color: PUBLIC_CHART_COLORS.brand },
        areaStyle: { color: 'rgba(53, 153, 102, 0.12)' },
      },
    ],
  };
}

export function PublicDownloadUsageOverTimeChart({ data }: PublicDownloadUsageOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="public-download-over-time-empty">
        No download usage activity over time recorded yet.
      </p>
    );
  }

  return (
    <EChart
      testId="public-download-over-time-chart"
      ariaLabel="Line chart of public downloads over time"
      option={buildOption(data)}
    />
  );
}
