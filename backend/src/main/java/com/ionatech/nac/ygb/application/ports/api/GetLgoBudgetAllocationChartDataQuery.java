package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.*;

public interface GetLgoBudgetAllocationChartDataQuery {

    LgoBudgetAllocationChartSeries getChart(
            LgoBudgetAllocationDashboardFilter filter,
            LgoBudgetAllocationChartType chartType,
            TimeSeriesGranularity granularity
    );
}
