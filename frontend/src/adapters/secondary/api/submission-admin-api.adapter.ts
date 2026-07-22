import { apiFetch } from '../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilter } from '../../../core/domain/dashboard-filter.model';
import type { SubmissionDetail, SubmissionPage } from '../../../core/domain/submission-admin.model';
import type { ISubmissionAdminApiPort } from '../../../ports/submission-admin-api.port';

const DEFAULT_PAGE_SIZE = 25;

export class HttpSubmissionAdminAdapter implements ISubmissionAdminApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async listSubmissions(
    filter: DashboardFilter,
    page: number,
    size = DEFAULT_PAGE_SIZE
  ): Promise<SubmissionPage> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const filterQuery = buildDashboardFilterQueryString(filter).replace(/^\?/, '');
    const params = new URLSearchParams(filterQuery);
    params.set('page', String(page));
    params.set('size', String(size));

    return apiFetch<SubmissionPage>(`/api/v1/admin/submissions?${params.toString()}`, { method: 'GET' }, token);
  }

  async getSubmissionDetail(id: string): Promise<SubmissionDetail> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    return apiFetch<SubmissionDetail>(`/api/v1/admin/submissions/${id}`, { method: 'GET' }, token);
  }
}
