package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record PublicAnonymisedRecordPage(
        List<PublicAnonymisedRecord> items,
        long totalElements,
        int page,
        int size
) {
    public PublicAnonymisedRecordPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("PublicAnonymisedRecordPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("PublicAnonymisedRecordPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        if (size == 0) {
            return 0;
        }
        return (int) Math.ceil((double) totalElements / size);
    }
}
