import type { EChartsOption } from 'echarts';
import type { DistrictBarItem } from '../../../../core/domain/dashboard-charts.model';
import type { DashboardChartDrillDownEvent } from '../../../../core/domain/dashboard-charts.model';
import { EChart } from '../components/EChart';

const BAR_COLOR = '#359966';
const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

export interface SubmissionsByDistrictChartProps {
  data: DistrictBarItem[];
  onDrillDown?: (event: DashboardChartDrillDownEvent) => void;
}

function buildOption(data: DistrictBarItem[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 64 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.districtName),
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
        itemStyle: { color: BAR_COLOR, borderRadius: [4, 4, 0, 0] },
        cursor: 'pointer',
      },
    ],
  };
}

export function SubmissionsByDistrictChart({ data, onDrillDown }: SubmissionsByDistrictChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-text-muted" data-testid="chart-district-empty">
        No district data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="chart-submissions-by-district"
      ariaLabel="Bar chart of submissions by district"
      option={buildOption(data)}
      onSegmentClick={(params) => {
        const entry = data[params.dataIndex ?? -1];
        if (entry) {
          onDrillDown?.({ dimension: 'district', value: entry.districtId });
        }
      }}
    />
  );
}
