package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record DownloadUsageAggregatesResponseDto(
        long totalDownloaders,
        long totalDownloads,
        List<GenderCountDto> byGender,
        List<AgeGroupCountDto> byAgeGroup,
        List<DatasetDownloadCountDto> byDataset,
        List<TimeSeriesPointDto> downloadsOverTime
) {
}
