package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PublicDashboardRestMapper {

    PublicSummaryResponseDto toSummaryResponse(PublicDashboardSummary summary);

    @Mapping(target = "chartType", expression = "java(series.chartType().pathSegment())")
    PublicChartSeriesResponseDto toChartResponse(PublicChartSeries series);

    PublicChartDataPointDto toDto(PublicChartDataPoint point);

    PublicHeatmapResponseDto toHeatmapResponse(PublicHeatmap heatmap);

    PublicHeatmapEntryDto toDto(HeatmapEntry entry);

    List<PublicChartDataPointDto> toChartPointDtoList(List<PublicChartDataPoint> points);

    List<PublicHeatmapEntryDto> toHeatmapEntryDtoList(List<HeatmapEntry> entries);

    @Mapping(target = "formType", expression = "java(domain.formType().name())")
    FormTypeCountDto toDto(FormTypeCount domain);

    GenderCountDto toDto(GenderCount domain);

    FinancialYearPeriodCountDto toDto(FinancialYearPeriodCount domain);

    default FormType mapFormType(String value) {
        return value == null ? null : FormType.valueOf(value);
    }
}
