package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;

public record CollectorSyncStatusResponseDto(
        long pendingCount,
        long syncedCount,
        LocalDateTime lastSyncedAt
) {}
