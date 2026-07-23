export type PublicChartTypePath = 'by-district' | 'by-gender' | 'by-age-group' | 'trend';

export interface PublicChartDataPoint {
  label: string;
  locationId: string | null;
  date: string | null;
  count: number;
}

export interface PublicChartSeries {
  chartType: PublicChartTypePath;
  data: PublicChartDataPoint[];
}

export interface PublicHeatmapEntry {
  districtId: string | null;
  parishId: string | null;
  label: string;
  count: number;
}

export interface PublicAgeGroupPieItem {
  ageGroup: string;
  label: string;
  count: number;
}

export interface PublicDistrictBarItem {
  districtId: string;
  districtName: string;
  count: number;
}

export interface PublicGenderPieItem {
  gender: string;
  label: string;
  count: number;
}

export interface PublicTimeSeriesChartItem {
  date: string;
  label: string;
  count: number;
}

export interface PublicDashboardChartsViewModel {
  byDistrict: PublicDistrictBarItem[];
  byGender: PublicGenderPieItem[];
  byAgeGroup: PublicAgeGroupPieItem[];
  overTime: PublicTimeSeriesChartItem[];
  heatmap: PublicHeatmapEntry[];
}

export const EMPTY_PUBLIC_DASHBOARD_CHARTS: PublicDashboardChartsViewModel = {
  byDistrict: [],
  byGender: [],
  byAgeGroup: [],
  overTime: [],
  heatmap: [],
};
