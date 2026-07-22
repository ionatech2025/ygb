export interface CollectorReceiptStatus {
  collectorId: string;
  fullName: string;
  syncedCount: number;
  flaggedCount: number;
  duplicateCount: number;
  lastReceivedAt: string | null;
  stale: boolean;
}

export interface AdminReceiptStatus {
  totalSynced: number;
  totalFlagged: number;
  totalDuplicate: number;
  byCollector: CollectorReceiptStatus[];
}

export const DEVICE_PENDING_INFO_MESSAGE =
  'This view shows server-side receipt counts only (SYNCED, FLAGGED, DUPLICATE). Submissions still pending on a collector device (PENDING) live in local IndexedDB and are not visible here.';
