import type { EChartsOption } from 'echarts';
import type {
  DashboardChartDrillDownEvent,
  TimeSeriesChartItem,
} from '../../../../core/domain/dashboard-charts.model';
import { EChart } from '../components/EChart';

const LINE_COLOR = '#19376d';
const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

export interface SubmissionsOverTimeChartProps {
  data: TimeSeriesChartItem[];
  onDrillDown?: (event: DashboardChartDrillDownEvent) => void;
}

function buildOption(data: TimeSeriesChartItem[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 48 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.label),
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
        type: 'line',
        data: data.map((entry) => entry.count),
        smooth: true,
        symbolSize: 8,
        lineStyle: { color: LINE_COLOR, width: 2 },
        itemStyle: { color: LINE_COLOR },
        areaStyle: { color: 'rgba(25, 55, 109, 0.08)' },
        cursor: 'pointer',
      },
    ],
  };
}

export function SubmissionsOverTimeChart({ data, onDrillDown }: SubmissionsOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-text-muted" data-testid="chart-over-time-empty">
        No time-series data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="chart-submissions-over-time"
      ariaLabel="Line chart of submissions over time"
      option={buildOption(data)}
      onSegmentClick={(params) => {
        const entry = data[params.dataIndex ?? -1];
        if (entry) {
          onDrillDown?.({ dimension: 'date', value: entry.date });
        }
      }}
    />
  );
}
