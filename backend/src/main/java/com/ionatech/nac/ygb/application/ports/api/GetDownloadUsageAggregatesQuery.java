package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

public interface GetDownloadUsageAggregatesQuery {
    DownloadUsageAggregates getAggregates(DownloadUsageFilter filter, TimeSeriesGranularity granularity);
}
