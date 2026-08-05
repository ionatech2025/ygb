import type { EChartsOption } from 'echarts';
import {
  formatDatasetLabel,
  type PublicDatasetDownloadCount,
} from '../../../../core/domain/public-download-usage.model';
import {
  PUBLIC_CHART_AXIS,
  PUBLIC_CHART_COLORS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface PublicDownloadUsageDatasetChartProps {
  data: PublicDatasetDownloadCount[];
}

function buildOption(data: PublicDatasetDownloadCount[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 56 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => formatDatasetLabel(entry.dataset)),
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
        type: 'bar',
        data: data.map((entry) => entry.count),
        itemStyle: { color: PUBLIC_CHART_COLORS.nacBlue, borderRadius: [8, 8, 0, 0] },
        barMaxWidth: 48,
      },
    ],
  };
}

export function PublicDownloadUsageDatasetChart({ data }: PublicDownloadUsageDatasetChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="public-download-dataset-empty">
        No dataset download comparison data available yet.
      </p>
    );
  }

  return (
    <EChart
      testId="public-download-dataset-chart"
      ariaLabel="Bar chart comparing dataset download counts"
      option={buildOption(data)}
    />
  );
}
