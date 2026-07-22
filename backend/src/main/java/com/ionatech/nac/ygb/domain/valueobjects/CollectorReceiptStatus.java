package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CollectorReceiptStatus(
        UUID collectorId,
        String fullName,
        long syncedCount,
        long flaggedCount,
        long duplicateCount,
        LocalDateTime lastReceivedAt,
        boolean stale
) {
    public CollectorReceiptStatus {
        if (collectorId == null) {
            throw new IllegalArgumentException("CollectorReceiptStatus collectorId must not be null.");
        }
        if (fullName == null) {
            throw new IllegalArgumentException("CollectorReceiptStatus fullName must not be null.");
        }
        if (syncedCount < 0 || flaggedCount < 0 || duplicateCount < 0) {
            throw new IllegalArgumentException("CollectorReceiptStatus counts must not be negative.");
        }
    }
}
