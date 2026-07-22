import type { PublicDashboardFilter } from '../core/domain/public-dashboard-filter.model';
import type { PublicDashboardSummary } from '../core/domain/public-dashboard-summary.model';

export interface PublicDashboardFilterOptions {
  formTypes: string[];
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
  programmeAreas: string[];
}

export interface IPublicDashboardApiPort {
  fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<PublicDashboardFilterOptions>;
  buildFilterQueryString(filter: PublicDashboardFilter): string;
  fetchSummary(filter: PublicDashboardFilter): Promise<PublicDashboardSummary>;
}
