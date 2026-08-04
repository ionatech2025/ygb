package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record PublicDownloadUsageAggregatesResponseDto(
        long totalDownloads,
        List<DatasetDownloadCountDto> byDataset,
        List<TimeSeriesPointDto> downloadsOverTime
) {
}
