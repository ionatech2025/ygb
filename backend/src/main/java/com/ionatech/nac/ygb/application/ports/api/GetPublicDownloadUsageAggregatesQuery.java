package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

import java.time.LocalDate;

public interface GetPublicDownloadUsageAggregatesQuery {
    PublicDownloadUsageAggregates getAggregates(
            LocalDate dateFrom,
            LocalDate dateTo,
            TimeSeriesGranularity granularity
    );
}
