package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record CollectorLeaderboardPage(
        List<CollectorLeaderboardEntry> items,
        long totalElements,
        int page,
        int size
) {
    public CollectorLeaderboardPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("CollectorLeaderboardPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("CollectorLeaderboardPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        return (int) Math.ceil((double) totalElements / size);
    }
}
