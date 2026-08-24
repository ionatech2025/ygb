import { apiFetch } from '../../../core/api/api-client';
import {
  EMPTY_COLLECTOR_SUBMISSION_FILTER,
  type CollectorSubmissionListFilter,
} from '../../../core/domain/collector-submission-list.model';
import type { CollectorBreakdown } from '../../../core/domain/collector-tracker.model';
import type { SubmissionPage } from '../../../core/domain/submission-admin.model';
import type { ICollectorSubmissionsApiPort } from '../../../ports/collector-submissions-api.port';

const DEFAULT_PAGE_SIZE = 25;

function buildMineQuery(filter: CollectorSubmissionListFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.formType) {
    params.set('formType', filter.formType);
  }
  if (filter.dateFrom) {
    params.set('dateFrom', filter.dateFrom);
  }
  if (filter.dateTo) {
    params.set('dateTo', filter.dateTo);
  }
  if (filter.financialYearPeriod) {
    params.set('financialYearPeriod', filter.financialYearPeriod);
  }
  return params;
}

export class HttpCollectorSubmissionsAdapter implements ICollectorSubmissionsApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async fetchMine(
    filter: CollectorSubmissionListFilter,
    page: number,
    size = DEFAULT_PAGE_SIZE
  ): Promise<SubmissionPage> {
    const token = this.requireToken();
    const params = buildMineQuery(filter);
    params.set('page', String(page));
    params.set('size', String(size));
    return apiFetch<SubmissionPage>(`/api/v1/submissions/mine?${params.toString()}`, { method: 'GET' }, token);
  }

  async fetchMineBreakdown(
    filter: CollectorSubmissionListFilter = EMPTY_COLLECTOR_SUBMISSION_FILTER
  ): Promise<CollectorBreakdown> {
    const token = this.requireToken();
    const params = buildMineQuery(filter);
    const query = params.toString();
    const path = query
      ? `/api/v1/submissions/mine/breakdown?${query}`
      : '/api/v1/submissions/mine/breakdown';
    return apiFetch<CollectorBreakdown>(path, { method: 'GET' }, token);
  }

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as a data collector.');
    }
    return token;
  }
}
