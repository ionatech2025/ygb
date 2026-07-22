package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.UUID;

/** Raw per-collector metrics from persistence before stale evaluation. */
public record CollectorReceiptMetrics(
        UUID collectorId,
        String fullName,
        long syncedCount,
        long flaggedCount,
        long duplicateCount,
        LocalDateTime lastReceivedAt
) {}
