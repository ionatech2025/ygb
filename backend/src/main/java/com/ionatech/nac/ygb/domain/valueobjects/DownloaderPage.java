package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record DownloaderPage(
        List<DownloaderSummary> items,
        long totalElements,
        int page,
        int size
) {
    public DownloaderPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("DownloaderPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("DownloaderPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        return (int) Math.ceil((double) totalElements / size);
    }
}
