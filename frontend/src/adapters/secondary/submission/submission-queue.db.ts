import Dexie, { Table } from 'dexie';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';

class YGBSubmissionDatabase extends Dexie {
  pendingSubmissions!: Table<PendingSubmission, number>;

  constructor() {
    super('YGBSubmissionDatabase');
    this.version(1).stores({
      pendingSubmissions: '++localId, formType, status, collectorId, deviceSubmissionId, createdAt',
    });
    this.version(2).stores({
      pendingSubmissions:
        '++localId, formType, status, collectorId, deviceSubmissionId, createdAt, respondentPhone, financialYearPeriod, [formType+respondentPhone+financialYearPeriod]',
    });
  }
}

export const submissionDb = new YGBSubmissionDatabase();
