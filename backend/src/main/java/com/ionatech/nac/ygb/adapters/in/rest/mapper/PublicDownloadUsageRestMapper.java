package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DatasetDownloadCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDownloadUsageAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.TimeSeriesPointDto;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PublicDownloadUsageRestMapper {

    DatasetDownloadCountDto toDatasetDto(DatasetDownloadCount count);

    TimeSeriesPointDto toTimeSeriesDto(TimeSeriesPoint point);

    default PublicDownloadUsageAggregatesResponseDto toResponse(PublicDownloadUsageAggregates aggregates) {
        return new PublicDownloadUsageAggregatesResponseDto(
                aggregates.totalDownloads(),
                aggregates.byDataset().stream().map(this::toDatasetDto).toList(),
                aggregates.downloadsOverTime().stream().map(this::toTimeSeriesDto).toList()
        );
    }
}
