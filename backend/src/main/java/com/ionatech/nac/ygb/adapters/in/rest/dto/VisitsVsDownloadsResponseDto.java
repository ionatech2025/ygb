package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record VisitsVsDownloadsResponseDto(
        long totalUniqueVisitors,
        long totalUniqueDownloaders,
        List<VisitsVsDownloadsPointDto> overTime
) {
}
