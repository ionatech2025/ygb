package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record AdminReceiptStatus(
        long totalSynced,
        long totalFlagged,
        long totalDuplicate,
        List<CollectorReceiptStatus> byCollector
) {
    public AdminReceiptStatus {
        if (totalSynced < 0 || totalFlagged < 0 || totalDuplicate < 0) {
            throw new IllegalArgumentException("AdminReceiptStatus totals must not be negative.");
        }
        if (byCollector == null) {
            throw new IllegalArgumentException("AdminReceiptStatus byCollector must not be null.");
        }
    }
}
