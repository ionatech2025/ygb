package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record BudgetPrioritySummary(
        long totalSubmissions,
        List<BudgetPrioritySectionCount> bySection,
        List<BudgetPriorityAreaCount> topPriorityAreas
) {
    public BudgetPrioritySummary {
        if (totalSubmissions < 0) {
            throw new IllegalArgumentException("BudgetPrioritySummary totalSubmissions must not be negative.");
        }
        bySection = List.copyOf(bySection);
        topPriorityAreas = List.copyOf(topPriorityAreas);
    }
}
