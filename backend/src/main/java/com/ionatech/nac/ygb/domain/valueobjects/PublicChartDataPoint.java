package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;
import java.util.UUID;

public record PublicChartDataPoint(
        String label,
        UUID locationId,
        LocalDate date,
        long count
) {
    public PublicChartDataPoint {
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("PublicChartDataPoint label must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("PublicChartDataPoint count must not be negative.");
        }
    }
}
