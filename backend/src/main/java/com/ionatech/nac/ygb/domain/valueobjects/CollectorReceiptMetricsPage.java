package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record CollectorReceiptMetricsPage(
        List<CollectorReceiptMetrics> items,
        long totalElements,
        int page,
        int size
) {
    public CollectorReceiptMetricsPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("CollectorReceiptMetricsPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("CollectorReceiptMetricsPage totalElements must not be negative.");
        }
    }
}
