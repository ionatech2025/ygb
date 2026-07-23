package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDate;

public record BudgetPriorityChartDataPoint(
        String label,
        LocalDate date,
        long count
) {
    public BudgetPriorityChartDataPoint {
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("BudgetPriorityChartDataPoint label must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("BudgetPriorityChartDataPoint count must not be negative.");
        }
    }
}
