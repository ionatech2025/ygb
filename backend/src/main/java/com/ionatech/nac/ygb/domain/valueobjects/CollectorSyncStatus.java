package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;

public record CollectorSyncStatus(
        long syncedCount,
        LocalDateTime lastSyncedAt
) {}
