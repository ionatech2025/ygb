package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record BudgetPriorityChartSeries(
        BudgetPriorityChartType chartType,
        List<BudgetPriorityChartDataPoint> data
) {
    public BudgetPriorityChartSeries {
        if (chartType == null) {
            throw new IllegalArgumentException("BudgetPriorityChartSeries chartType must not be null.");
        }
        data = List.copyOf(data);
    }
}
