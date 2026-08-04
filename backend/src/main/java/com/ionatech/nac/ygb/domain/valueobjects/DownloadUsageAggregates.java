package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record DownloadUsageAggregates(
        long totalDownloaders,
        long totalDownloads,
        List<GenderCount> byGender,
        List<AgeGroupCount> byAgeGroup,
        List<DatasetDownloadCount> byDataset,
        List<TimeSeriesPoint> downloadsOverTime
) {
    public DownloadUsageAggregates {
        if (totalDownloaders < 0 || totalDownloads < 0) {
            throw new IllegalArgumentException("DownloadUsageAggregates totals must not be negative.");
        }
        byGender = List.copyOf(byGender);
        byAgeGroup = List.copyOf(byAgeGroup);
        byDataset = List.copyOf(byDataset);
        downloadsOverTime = List.copyOf(downloadsOverTime);
    }
}
