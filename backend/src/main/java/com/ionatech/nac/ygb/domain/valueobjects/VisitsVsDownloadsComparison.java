package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record VisitsVsDownloadsComparison(
        long totalUniqueVisitors,
        long totalUniqueDownloaders,
        List<VisitsVsDownloadsPoint> overTime
) {
    public VisitsVsDownloadsComparison {
        if (totalUniqueVisitors < 0 || totalUniqueDownloaders < 0) {
            throw new IllegalArgumentException("totals must not be negative");
        }
        overTime = List.copyOf(overTime);
    }
}
