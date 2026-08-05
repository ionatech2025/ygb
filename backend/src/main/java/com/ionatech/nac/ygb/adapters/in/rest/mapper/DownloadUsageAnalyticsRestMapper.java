package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AgeGroupCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DatasetDownloadCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloadUsageAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloaderPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloaderSummaryDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.GenderCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.TimeSeriesPointDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.VisitsVsDownloadsPointDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.VisitsVsDownloadsResponseDto;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroupCount;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderSummary;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsPoint;
import org.mapstruct.Mapper;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface DownloadUsageAnalyticsRestMapper {

    DownloaderSummaryDto toDownloaderDto(DownloaderSummary summary);

    default DownloaderPageResponseDto toPageResponse(DownloaderPage page) {
        return new DownloaderPageResponseDto(
                page.items().stream().map(this::toDownloaderDto).toList(),
                page.totalElements(),
                page.page(),
                page.size(),
                page.totalPages()
        );
    }

    GenderCountDto toGenderCountDto(GenderCount count);

    AgeGroupCountDto toAgeGroupCountDto(AgeGroupCount count);

    DatasetDownloadCountDto toDatasetCountDto(DatasetDownloadCount count);

    TimeSeriesPointDto toTimeSeriesPointDto(TimeSeriesPoint point);

    default DownloadUsageAggregatesResponseDto toAggregatesResponse(DownloadUsageAggregates aggregates) {
        return new DownloadUsageAggregatesResponseDto(
                aggregates.totalDownloaders(),
                aggregates.totalDownloads(),
                aggregates.byGender().stream().map(this::toGenderCountDto).toList(),
                aggregates.byAgeGroup().stream().map(this::toAgeGroupCountDto).toList(),
                aggregates.byDataset().stream().map(this::toDatasetCountDto).toList(),
                aggregates.downloadsOverTime().stream().map(this::toTimeSeriesPointDto).toList()
        );
    }

    VisitsVsDownloadsPointDto toVisitsPointDto(VisitsVsDownloadsPoint point);

    default VisitsVsDownloadsResponseDto toVisitsResponse(VisitsVsDownloadsComparison comparison) {
        return new VisitsVsDownloadsResponseDto(
                comparison.totalUniqueVisitors(),
                comparison.totalUniqueDownloaders(),
                comparison.overTime().stream().map(this::toVisitsPointDto).toList()
        );
    }

    default DownloadUsageFilter toFilter(
            String gender,
            String ageGroup,
            String countryCode,
            String fieldOfOperation,
            String dataset,
            LocalDate dateFrom,
            LocalDate dateTo
    ) {
        PublicDownloadDataset datasetEnum = null;
        if (dataset != null && !dataset.isBlank()) {
            datasetEnum = PublicDownloadDataset.valueOf(dataset.trim());
        }
        return new DownloadUsageFilter(
                gender,
                ageGroup,
                countryCode,
                fieldOfOperation,
                datasetEnum,
                dateFrom,
                dateTo
        );
    }
}
