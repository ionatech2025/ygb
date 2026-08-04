import type { EChartsOption } from 'echarts';
import type { VisitsVsDownloadsPoint } from '../../../../core/domain/download-usage-analytics.model';
import { EChart } from '../components/EChart';

const VISITOR_COLOR = '#19376d';
const DOWNLOADER_COLOR = '#359966';
const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

export interface VisitsVsDownloadsChartProps {
  data: VisitsVsDownloadsPoint[];
}

function buildOption(data: VisitsVsDownloadsPoint[]): EChartsOption {
  return {
    animation: false,
    color: [VISITOR_COLOR, DOWNLOADER_COLOR],
    grid: { left: 48, right: 16, top: 32, bottom: 48 },
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      textStyle: { color: AXIS_COLOR },
    },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.bucketStart),
      axisLabel: { color: AXIS_COLOR },
      axisLine: { lineStyle: { color: GRID_COLOR } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: AXIS_COLOR },
      splitLine: { lineStyle: { color: GRID_COLOR } },
    },
    series: [
      {
        name: 'Unique visitors',
        type: 'line',
        data: data.map((entry) => entry.visitorCount),
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 2 },
      },
      {
        name: 'Unique downloaders',
        type: 'line',
        data: data.map((entry) => entry.downloaderCount),
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 2 },
      },
    ],
  };
}

export function VisitsVsDownloadsChart({ data }: VisitsVsDownloadsChartProps) {
  if (data.length === 0) {
    return (
      <p
        className="flex h-64 items-center justify-center text-sm text-text-muted"
        data-testid="visits-vs-downloads-chart-empty"
      >
        No visitor or downloader time-series for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="visits-vs-downloads-chart"
      ariaLabel="Line chart comparing unique visitors and unique downloaders over time"
      option={buildOption(data)}
    />
  );
}
