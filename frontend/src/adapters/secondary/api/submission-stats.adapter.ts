import { fetchCollectorSubmissionCount } from '../../../core/api/collector-api';
import type { ISubmissionStatsPort } from '../../../ports/submission-stats.port';
import type { ISubmissionQueuePort } from '../../../ports/submission-queue.port';
import { submissionQueue } from '../submission/submission-queue.adapter';

export class SubmissionStatsAdapter implements ISubmissionStatsPort {
  constructor(private queue: ISubmissionQueuePort = submissionQueue) {}

  countTodayLocal(): Promise<number> {
    return this.queue.countTodayLocal();
  }

  fetchServerDailyCount(accessToken: string): Promise<number> {
    return fetchCollectorSubmissionCount(accessToken);
  }
}

export const submissionStats = new SubmissionStatsAdapter();
