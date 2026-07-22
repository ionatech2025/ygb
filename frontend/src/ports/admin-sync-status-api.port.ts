import type { AdminReceiptStatus } from '../core/domain/admin-receipt-status.model';

export interface IAdminSyncStatusApiPort {
  fetchReceiptStatus(): Promise<AdminReceiptStatus>;
}
