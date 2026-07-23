export interface PublicDashboardSummary {
  totalSubmissions: number;
  byFormType: Array<{ formType: string; count: number }>;
  byGender: Array<{ gender: string; count: number }>;
  byFinancialYearPeriod: Array<{ financialYearPeriod: string; count: number }>;
}
