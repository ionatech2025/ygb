package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;

public interface GetVisitsVsDownloadsQuery {
    VisitsVsDownloadsComparison getComparison(DownloadUsageFilter filter, TimeSeriesGranularity granularity);
}
