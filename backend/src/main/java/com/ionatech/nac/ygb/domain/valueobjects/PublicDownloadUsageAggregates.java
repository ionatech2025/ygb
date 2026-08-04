package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

/** Anonymised public download-usage aggregates — no profile/contact fields. */
public record PublicDownloadUsageAggregates(
        long totalDownloads,
        List<DatasetDownloadCount> byDataset,
        List<TimeSeriesPoint> downloadsOverTime
) {
    public PublicDownloadUsageAggregates {
        if (totalDownloads < 0) {
            throw new IllegalArgumentException("totalDownloads must not be negative");
        }
        byDataset = List.copyOf(byDataset);
        downloadsOverTime = List.copyOf(downloadsOverTime);
    }
}
