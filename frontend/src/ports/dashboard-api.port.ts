import type { DashboardAggregates } from '../core/domain/dashboard-aggregates.model';
import type { DashboardFilter } from '../core/domain/dashboard-filter.model';

export interface DashboardFilterOptions {
  districts: Array<{ id: string; name: string }>;
  subcounties: Array<{ id: string; name: string }>;
  parishes: Array<{ id: string; name: string }>;
  formTypes: string[];
  genders: string[];
  ageGroups: string[];
  collectors: Array<{ id: string; fullName: string }>;
  financialYearPeriods: string[];
}

export interface IDashboardApiPort {
  fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<DashboardFilterOptions>;
  buildFilterQueryString(filter: DashboardFilter): string;
  fetchAggregates(filter: DashboardFilter): Promise<DashboardAggregates>;
}
