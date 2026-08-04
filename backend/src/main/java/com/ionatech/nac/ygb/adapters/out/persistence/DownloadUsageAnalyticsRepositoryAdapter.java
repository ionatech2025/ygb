package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import org.springframework.stereotype.Component;

@Component
public class DownloadUsageAnalyticsRepositoryAdapter implements DownloadUsageAnalyticsRepositoryPort {

    private final DownloadUsageAnalyticsJpaRepository jpaRepository;

    public DownloadUsageAnalyticsRepositoryAdapter(DownloadUsageAnalyticsJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public DownloaderPage findDownloaders(DownloadUsageFilter filter, PageRequest pageRequest) {
        return jpaRepository.findDownloaders(filter, pageRequest);
    }

    @Override
    public DownloadUsageAggregates getDownloadUsageAggregates(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    ) {
        return jpaRepository.getDownloadUsageAggregates(filter, granularity);
    }

    @Override
    public VisitsVsDownloadsComparison getVisitsVsDownloads(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    ) {
        return jpaRepository.getVisitsVsDownloads(filter, granularity);
    }
}
