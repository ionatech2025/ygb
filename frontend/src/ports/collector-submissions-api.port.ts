import type { CollectorSubmissionListFilter } from '../core/domain/collector-submission-list.model';
import type { CollectorBreakdown } from '../core/domain/collector-tracker.model';
import type { SubmissionPage } from '../core/domain/submission-admin.model';

export interface ICollectorSubmissionsApiPort {
  fetchMine(filter: CollectorSubmissionListFilter, page: number, size?: number): Promise<SubmissionPage>;
  fetchMineBreakdown(filter?: CollectorSubmissionListFilter): Promise<CollectorBreakdown>;
}
