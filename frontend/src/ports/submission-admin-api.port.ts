import type { DashboardFilter } from '../core/domain/dashboard-filter.model';
import type { SubmissionDetail, SubmissionPage } from '../core/domain/submission-admin.model';

export interface ISubmissionAdminApiPort {
  listSubmissions(filter: DashboardFilter, page: number, size?: number): Promise<SubmissionPage>;
  getSubmissionDetail(id: string): Promise<SubmissionDetail>;
}
