package com.ionatech.nac.ygb.domain.valueobjects;

public record BudgetPrioritySectionCount(String section, long count) {
    public BudgetPrioritySectionCount {
        if (section == null || section.isBlank()) {
            throw new IllegalArgumentException("BudgetPrioritySectionCount section must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("BudgetPrioritySectionCount count must not be negative.");
        }
    }
}
