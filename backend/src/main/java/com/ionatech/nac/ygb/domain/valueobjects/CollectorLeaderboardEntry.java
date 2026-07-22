package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record CollectorLeaderboardEntry(UUID collectorId, String fullName, long totalCount) {
    public CollectorLeaderboardEntry {
        if (collectorId == null) {
            throw new IllegalArgumentException("CollectorLeaderboardEntry collectorId must not be null.");
        }
        if (fullName == null) {
            throw new IllegalArgumentException("CollectorLeaderboardEntry fullName must not be null.");
        }
        if (totalCount < 0) {
            throw new IllegalArgumentException("CollectorLeaderboardEntry totalCount must not be negative.");
        }
    }
}
