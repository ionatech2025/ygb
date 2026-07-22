export type DashboardChartDimension = 'district' | 'gender' | 'date';

export interface DashboardChartDrillDownEvent {
  dimension: DashboardChartDimension;
  value: string;
}

export interface DistrictBarItem {
  districtId: string;
  districtName: string;
  count: number;
}

export interface GenderPieItem {
  gender: string;
  label: string;
  count: number;
}

export interface TimeSeriesChartItem {
  date: string;
  label: string;
  count: number;
}

export interface DashboardChartsViewModel {
  byDistrict: DistrictBarItem[];
  byGender: GenderPieItem[];
  overTime: TimeSeriesChartItem[];
}
