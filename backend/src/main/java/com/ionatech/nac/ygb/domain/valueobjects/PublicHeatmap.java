package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record PublicHeatmap(List<HeatmapEntry> entries) {
    public PublicHeatmap {
        entries = List.copyOf(entries);
    }
}
