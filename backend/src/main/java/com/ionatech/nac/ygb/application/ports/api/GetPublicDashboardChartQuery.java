package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PublicChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.PublicChartType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

public interface GetPublicDashboardChartQuery {
    PublicChartSeries getChart(
            PublicDashboardFilter filter,
            PublicChartType chartType,
            TimeSeriesGranularity granularity
    );
}
