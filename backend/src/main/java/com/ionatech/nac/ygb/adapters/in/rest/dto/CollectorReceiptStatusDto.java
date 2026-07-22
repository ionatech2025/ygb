package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CollectorReceiptStatusDto(
        UUID collectorId,
        String fullName,
        long syncedCount,
        long flaggedCount,
        long duplicateCount,
        LocalDateTime lastReceivedAt,
        boolean stale
) {}
