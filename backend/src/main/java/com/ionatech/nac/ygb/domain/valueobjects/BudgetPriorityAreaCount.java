package com.ionatech.nac.ygb.domain.valueobjects;

public record BudgetPriorityAreaCount(String priorityArea, long count) {
    public BudgetPriorityAreaCount {
        if (priorityArea == null || priorityArea.isBlank()) {
            throw new IllegalArgumentException("BudgetPriorityAreaCount priorityArea must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("BudgetPriorityAreaCount count must not be negative.");
        }
    }
}
