package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetPublicDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

import java.time.LocalDate;

public class GetPublicDownloadUsageAggregatesService implements GetPublicDownloadUsageAggregatesQuery {

    private final DownloadUsageAnalyticsRepositoryPort repository;

    public GetPublicDownloadUsageAggregatesService(DownloadUsageAnalyticsRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    public PublicDownloadUsageAggregates getAggregates(
            LocalDate dateFrom,
            LocalDate dateTo,
            TimeSeriesGranularity granularity
    ) {
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new IllegalArgumentException("dateFrom must not be after dateTo");
        }
        TimeSeriesGranularity effective = granularity != null ? granularity : TimeSeriesGranularity.DAY;
        return repository.getPublicDownloadUsageAggregates(dateFrom, dateTo, effective);
    }
}
