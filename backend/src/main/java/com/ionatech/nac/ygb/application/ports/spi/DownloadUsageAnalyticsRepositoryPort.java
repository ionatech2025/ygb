package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;

import java.time.LocalDate;

public interface DownloadUsageAnalyticsRepositoryPort {

    DownloaderPage findDownloaders(DownloadUsageFilter filter, PageRequest pageRequest);

    DownloadUsageAggregates getDownloadUsageAggregates(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    );

    VisitsVsDownloadsComparison getVisitsVsDownloads(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    );

    /** Aggregates over download_events only — never joins download_profiles. */
    PublicDownloadUsageAggregates getPublicDownloadUsageAggregates(
            LocalDate dateFrom,
            LocalDate dateTo,
            TimeSeriesGranularity granularity
    );
}
