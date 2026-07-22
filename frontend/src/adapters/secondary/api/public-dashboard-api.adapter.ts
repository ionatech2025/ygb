import { apiFetch } from '../../../core/api/api-client';
import { buildPublicDashboardFilterQueryString } from '../../../core/domain/public-dashboard-filter.model';
import type { PublicDashboardFilter } from '../../../core/domain/public-dashboard-filter.model';
import type { PublicDashboardSummary } from '../../../core/domain/public-dashboard-summary.model';
import type {
  IPublicDashboardApiPort,
  PublicDashboardFilterOptions,
} from '../../../ports/public-dashboard-api.port';

interface BackendPublicFilterOptionsResponse {
  districts: Array<{ id: string; name: string }>;
  subcounties: Array<{ id: string; name: string }>;
  parishes: Array<{ id: string; name: string }>;
  formTypes: string[];
  genders: string[];
  ageGroups: string[];
  financialYearPeriods: string[];
  programmeAreas: string[];
}

interface BackendPublicSummaryResponse {
  totalSubmissions: number;
  byFormType: Array<{ formType: string; count: number }>;
  byGender: Array<{ gender: string; count: number }>;
  byFinancialYearPeriod: Array<{ financialYearPeriod: string; count: number }>;
}

function mapFilterOptions(response: BackendPublicFilterOptionsResponse): PublicDashboardFilterOptions {
  return {
    formTypes: response.formTypes,
    genders: response.genders,
    ageGroups: response.ageGroups,
    financialYearPeriods: response.financialYearPeriods,
    programmeAreas: response.programmeAreas,
  };
}

export function mapPublicSummaryResponse(response: BackendPublicSummaryResponse): PublicDashboardSummary {
  return {
    totalSubmissions: response.totalSubmissions,
    byFormType: response.byFormType,
    byGender: response.byGender,
    byFinancialYearPeriod: response.byFinancialYearPeriod,
  };
}

export class HttpPublicDashboardAdapter implements IPublicDashboardApiPort {
  buildFilterQueryString(filter: PublicDashboardFilter): string {
    return buildPublicDashboardFilterQueryString(filter);
  }

  async fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<PublicDashboardFilterOptions> {
    const params = new URLSearchParams();
    if (districtId) params.set('districtId', districtId);
    if (subcountyId) params.set('subcountyId', subcountyId);
    const query = params.toString();

    const response = await apiFetch<BackendPublicFilterOptionsResponse>(
      `/api/v1/public/dashboard/filters/options${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapFilterOptions(response);
  }

  async fetchSummary(filter: PublicDashboardFilter): Promise<PublicDashboardSummary> {
    const query = this.buildFilterQueryString(filter).replace(/^\?/, '');
    const response = await apiFetch<BackendPublicSummaryResponse>(
      `/api/v1/public/dashboard/summary${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
    return mapPublicSummaryResponse(response);
  }
}
