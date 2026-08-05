package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.api.GetVisitsVsDownloadsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListDownloadersQuery;
import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;

public class DownloadUsageAnalyticsService
        implements ListDownloadersQuery, GetDownloadUsageAggregatesQuery, GetVisitsVsDownloadsQuery {

    private final DownloadUsageAnalyticsRepositoryPort repository;

    public DownloadUsageAnalyticsService(DownloadUsageAnalyticsRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    public DownloaderPage list(DownloadUsageFilter filter, PageRequest pageRequest) {
        return repository.findDownloaders(effective(filter), effectivePage(pageRequest));
    }

    @Override
    public DownloadUsageAggregates getAggregates(DownloadUsageFilter filter, TimeSeriesGranularity granularity) {
        return repository.getDownloadUsageAggregates(effective(filter), effectiveGranularity(granularity));
    }

    @Override
    public VisitsVsDownloadsComparison getComparison(DownloadUsageFilter filter, TimeSeriesGranularity granularity) {
        return repository.getVisitsVsDownloads(effective(filter), effectiveGranularity(granularity));
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
