package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record SubmissionPage(
        List<SubmissionSummary> items,
        long totalElements,
        int page,
        int size
) {
    public SubmissionPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("SubmissionPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("SubmissionPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        if (size == 0) {
            return 0;
        }
        return (int) Math.ceil((double) totalElements / size);
    }
}
