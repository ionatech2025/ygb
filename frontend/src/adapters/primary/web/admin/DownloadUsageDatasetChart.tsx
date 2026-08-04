import type { EChartsOption } from 'echarts';
import type { DatasetDownloadCountItem } from '../../../../core/domain/download-usage-analytics.model';
import { EChart } from '../components/EChart';

const BAR_COLOR = '#359966';
const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

export interface DownloadUsageDatasetChartProps {
  data: DatasetDownloadCountItem[];
}

function buildOption(data: DatasetDownloadCountItem[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 64 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.dataset),
      axisLabel: { color: AXIS_COLOR, rotate: data.length > 4 ? 30 : 0 },
      axisLine: { lineStyle: { color: GRID_COLOR } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: AXIS_COLOR },
      splitLine: { lineStyle: { color: GRID_COLOR } },
    },
    series: [
      {
        type: 'bar',
        data: data.map((entry) => entry.count),
        itemStyle: { color: BAR_COLOR, borderRadius: [8, 8, 0, 0] },
        barMaxWidth: 48,
      },
    ],
  };
}

export function DownloadUsageDatasetChart({ data }: DownloadUsageDatasetChartProps) {
  if (data.length === 0) {
    return (
      <p
        className="flex h-64 items-center justify-center text-sm text-text-muted"
        data-testid="download-usage-dataset-chart-empty"
      >
        No dataset download data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="download-usage-dataset-chart"
      ariaLabel="Bar chart of downloads by dataset"
      option={buildOption(data)}
    />
  );
}
