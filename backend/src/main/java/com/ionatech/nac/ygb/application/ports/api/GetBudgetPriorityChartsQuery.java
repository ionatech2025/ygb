package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartType;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

public interface GetBudgetPriorityChartsQuery {
    BudgetPriorityChartSeries getChart(
            BudgetPriorityDashboardFilter filter,
            BudgetPriorityChartType chartType,
            TimeSeriesGranularity granularity
    );
}
