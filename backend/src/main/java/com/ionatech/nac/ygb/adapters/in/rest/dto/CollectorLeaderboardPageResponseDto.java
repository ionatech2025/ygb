package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record CollectorLeaderboardPageResponseDto(
        List<CollectorLeaderboardEntryDto> items,
        long totalElements,
        int page,
        int size,
        int totalPages
) {
}
