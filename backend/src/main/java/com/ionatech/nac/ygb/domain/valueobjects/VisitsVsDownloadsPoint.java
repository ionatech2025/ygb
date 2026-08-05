package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;

public record VisitsVsDownloadsPoint(
        LocalDate bucketStart,
        long visitorCount,
        long downloaderCount
) {
    public VisitsVsDownloadsPoint {
        if (bucketStart == null) {
            throw new IllegalArgumentException("bucketStart must not be null");
        }
        if (visitorCount < 0 || downloaderCount < 0) {
            throw new IllegalArgumentException("counts must not be negative");
        }
    }
}
