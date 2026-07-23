import type { EChartsOption } from 'echarts';
import type { PublicDistrictBarItem } from '../../../../core/domain/public-dashboard-charts.model';
import {
  PUBLIC_CHART_AXIS,
  PUBLIC_CHART_COLORS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

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
      axisLabel: { color: PUBLIC_CHART_AXIS.label, rotate: data.length > 4 ? 30 : 0 },
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
        itemStyle: { color: PUBLIC_CHART_COLORS.brand, borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
}

export function PublicSubmissionsByDistrictChart({ data }: PublicSubmissionsByDistrictChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="chart-district-empty">
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
