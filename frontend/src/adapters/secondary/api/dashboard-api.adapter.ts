import { apiFetch } from '../../../core/api/api-client';
import type { DashboardAggregates } from '../../../core/domain/dashboard-aggregates.model';
import { buildDashboardFilterQueryString } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilter } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilterOptions, IDashboardApiPort } from '../../../ports/dashboard-api.port';

interface BackendAggregatesResponse {
  totalSubmissions: number;
  byDistrict: Array<{ districtName: string; districtId: string; count: number }>;
  byGender: Array<{ gender: string; count: number }>;
  overTime: Array<{ date: string; count: number }>;
  byFormType: Array<{ formType: string; count: number }>;
  byFinancialYearPeriod: Array<{ financialYearPeriod: string; count: number }>;
}

interface BackendFilterOptionsResponse {
  districts: Array<{ id: string; name: string }>;
  subcounties: Array<{ id: string; name: string }>;
  parishes: Array<{ id: string; name: string }>;
  formTypes: string[];
  genders: string[];
  ageGroups: string[];
  collectors: Array<{ id: string; fullName: string }>;
  financialYearPeriods: string[];
}

export class HttpDashboardAdapter implements IDashboardApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  buildFilterQueryString(filter: DashboardFilter): string {
    return buildDashboardFilterQueryString(filter);
  }

  async fetchFilterOptions(districtId?: string, subcountyId?: string): Promise<DashboardFilterOptions> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const params = new URLSearchParams();
    if (districtId) params.set('districtId', districtId);
    if (subcountyId) params.set('subcountyId', subcountyId);
    const query = params.toString();

    return apiFetch<BackendFilterOptionsResponse>(
      `/api/v1/admin/dashboard/filters/options${query ? `?${query}` : ''}`,
      { method: 'GET' },
      token
    );
  }

  async fetchAggregates(filter: DashboardFilter): Promise<DashboardAggregates> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const query = this.buildFilterQueryString(filter).replace(/^\?/, '');
    return apiFetch<BackendAggregatesResponse>(
      `/api/v1/admin/dashboard/aggregates${query ? `?${query}` : ''}`,
      { method: 'GET' },
      token
    );
  }
}
