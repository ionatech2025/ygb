package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

public interface GetDashboardAggregatesQuery {
    DashboardAggregates getAggregates(DashboardFilter filter, TimeSeriesGranularity granularity);
}
