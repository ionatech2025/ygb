package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

/** Geographic aggregation for public heat-map tooltips — no respondent identifiers. */
public record HeatmapEntry(
        UUID districtId,
        UUID parishId,
        String label,
        long count
) {
    public HeatmapEntry {
        if (districtId == null) {
            throw new IllegalArgumentException("HeatmapEntry districtId must not be null.");
        }
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("HeatmapEntry label must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("HeatmapEntry count must not be negative.");
        }
    }
}
