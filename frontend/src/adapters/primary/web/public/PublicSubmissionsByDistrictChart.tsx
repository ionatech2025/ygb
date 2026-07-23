import type { EChartsOption } from 'echarts';
import type { PublicDistrictBarItem } from '../../../../core/domain/public-dashboard-charts.model';
import { EChart } from '../components/EChart';

const BAR_COLOR = '#359966';
const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

export interface PublicSubmissionsByDistrictChartProps {
  data: PublicDistrictBarItem[];
}

function buildOption(data: PublicDistrictBarItem[]): EChartsOption {
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
      },
    ],
  };
}

export function PublicSubmissionsByDistrictChart({ data }: PublicSubmissionsByDistrictChartProps) {
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
    />
  );
}
