package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record DownloaderPageResponseDto(
        List<DownloaderSummaryDto> items,
        long totalElements,
        int page,
        int size,
        int totalPages
) {
}
