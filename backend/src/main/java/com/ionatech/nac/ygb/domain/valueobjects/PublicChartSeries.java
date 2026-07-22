package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record PublicChartSeries(
        PublicChartType chartType,
        List<PublicChartDataPoint> data
) {
    public PublicChartSeries {
        if (chartType == null) {
            throw new IllegalArgumentException("PublicChartSeries chartType must not be null.");
        }
        data = List.copyOf(data);
    }
}
