package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.api.GetVisitsVsDownloadsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListDownloadersQuery;
import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;

import java.util.Objects;

public class DownloadUsageAnalyticsService
        implements ListDownloadersQuery, GetDownloadUsageAggregatesQuery, GetVisitsVsDownloadsQuery {

    private final DownloadUsageAnalyticsRepositoryPort repository;
    private final ToolDownloadCatalogue catalogue;

    public DownloadUsageAnalyticsService(
            DownloadUsageAnalyticsRepositoryPort repository,
            ToolDownloadCatalogue catalogue
    ) {
        this.repository = Objects.requireNonNull(repository);
        this.catalogue = Objects.requireNonNull(catalogue);
    }

    @Override
    public DownloaderPage list(DownloadUsageFilter filter, PageRequest pageRequest) {
        return repository.findDownloaders(effective(filter), effectivePage(pageRequest));
    }

    @Override
    public DownloadUsageAggregates getAggregates(DownloadUsageFilter filter, TimeSeriesGranularity granularity) {
        DownloadUsageAggregates aggregates =
                repository.getDownloadUsageAggregates(effective(filter), effectiveGranularity(granularity));
        return withDisplayLabels(aggregates);
    }

    @Override
    public VisitsVsDownloadsComparison getComparison(DownloadUsageFilter filter, TimeSeriesGranularity granularity) {
        return repository.getVisitsVsDownloads(effective(filter), effectiveGranularity(granularity));
    }

    private DownloadUsageAggregates withDisplayLabels(DownloadUsageAggregates aggregates) {
        return new DownloadUsageAggregates(
                aggregates.totalDownloaders(),
                aggregates.totalDownloads(),
                aggregates.byGender(),
                aggregates.byAgeGroup(),
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

    private static DownloadUsageFilter effective(DownloadUsageFilter filter) {
        return filter != null ? filter : DownloadUsageFilter.empty();
    }

    private static PageRequest effectivePage(PageRequest pageRequest) {
        return pageRequest != null ? pageRequest : PageRequest.of(0, 25);
    }

    private static TimeSeriesGranularity effectiveGranularity(TimeSeriesGranularity granularity) {
        return granularity != null ? granularity : TimeSeriesGranularity.DAY;
    }
}
