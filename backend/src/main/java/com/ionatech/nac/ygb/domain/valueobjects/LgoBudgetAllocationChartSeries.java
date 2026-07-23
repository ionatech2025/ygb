package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record LgoBudgetAllocationChartSeries(
        LgoBudgetAllocationChartType chartType,
        List<BudgetPriorityChartDataPoint> data
) {
    public LgoBudgetAllocationChartSeries {
        if (chartType == null) {
            throw new IllegalArgumentException("chartType must not be null.");
        }
        data = List.copyOf(data);
    }
}
