import type { FormType } from './form-type.model';

export type SubmissionQueueStatus = 'PENDING' | 'SYNCED' | 'FAILED';

export interface PendingSubmission {
  localId?: number;
  formType: FormType;
  collectorId: string;
  deviceSubmissionId: string;
  status: SubmissionQueueStatus;
  retryCount: number;
  createdAt: string;
  syncedAt?: string;
  payload: object;
}
