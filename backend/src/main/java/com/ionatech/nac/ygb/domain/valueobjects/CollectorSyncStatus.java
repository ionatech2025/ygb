package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;

public record CollectorSyncStatus(
        long pendingCount,
        long syncedCount,
        LocalDateTime lastSyncedAt
) {}
