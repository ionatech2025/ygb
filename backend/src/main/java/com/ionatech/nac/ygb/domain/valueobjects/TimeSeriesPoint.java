package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;

public record TimeSeriesPoint(LocalDate bucketStart, long count) {
    public TimeSeriesPoint {
        if (bucketStart == null) {
            throw new IllegalArgumentException("TimeSeriesPoint bucketStart must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("TimeSeriesPoint count must not be negative.");
        }
    }
}
