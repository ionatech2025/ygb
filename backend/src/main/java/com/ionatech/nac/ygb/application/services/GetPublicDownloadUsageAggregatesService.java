package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetPublicDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;

import java.time.LocalDate;
import java.util.Objects;

public class GetPublicDownloadUsageAggregatesService implements GetPublicDownloadUsageAggregatesQuery {

    private final DownloadUsageAnalyticsRepositoryPort repository;
    private final ToolDownloadCatalogue catalogue;

    public GetPublicDownloadUsageAggregatesService(
            DownloadUsageAnalyticsRepositoryPort repository,
            ToolDownloadCatalogue catalogue
    ) {
        this.repository = Objects.requireNonNull(repository);
        this.catalogue = Objects.requireNonNull(catalogue);
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
        PublicDownloadUsageAggregates aggregates =
                repository.getPublicDownloadUsageAggregates(dateFrom, dateTo, effective);
        return withDisplayLabels(aggregates);
    }

    private PublicDownloadUsageAggregates withDisplayLabels(PublicDownloadUsageAggregates aggregates) {
        return new PublicDownloadUsageAggregates(
                aggregates.totalDownloads(),
                aggregates.byDataset().stream()
                        .map(row -> new DatasetDownloadCount(displayLabel(row.dataset()), row.count()))
                        .toList(),
                aggregates.downloadsOverTime()
        );
    }

    private String displayLabel(String dataset) {
        try {
            return catalogue.analyticsDisplayLabel(PublicDownloadDataset.valueOf(dataset));
        } catch (IllegalArgumentException ex) {
            return dataset;
        }
    }
}
