export interface DistrictCount {
  districtName: string;
  districtId: string;
  count: number;
}

export interface GenderCount {
  gender: string;
  count: number;
}

export interface FormTypeCount {
  formType: string;
  count: number;
}

export interface FinancialYearPeriodCount {
  financialYearPeriod: string;
  count: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface DashboardAggregates {
  totalSubmissions: number;
  byDistrict: DistrictCount[];
  byGender: GenderCount[];
  overTime: TimeSeriesPoint[];
  byFormType: FormTypeCount[];
  byFinancialYearPeriod: FinancialYearPeriodCount[];
}
