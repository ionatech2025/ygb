package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record BudgetPriorityAnonymisedRecordPage(
        List<BudgetPriorityAnonymisedRecord> items,
        long totalElements,
        int page,
        int size
) {
    public BudgetPriorityAnonymisedRecordPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecordPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecordPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        if (size == 0) {
            return 0;
        }
        return (int) Math.ceil((double) totalElements / size);
    }
}
